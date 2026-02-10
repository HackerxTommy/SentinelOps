/**
 * SentinelOps Scan Engine — Orchestrator
 *
 * Runs the Python native_recon.py for reconnaissance, then feeds results
 * to Gemini AI for vulnerability analysis. No Docker required.
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const Scan = require('../models/Scan');
const Issue = require('../models/Issue');
const { analyzeResults, reviewPRDiff, analyzeCode } = require('./ai/analyzer');

const SCAN_TIMEOUT = 10 * 60 * 1000; // 10 minutes max

class ScanOrchestrator {
  constructor(scanDoc, userId) {
    this.scan = scanDoc;
    this.scanId = scanDoc._id.toString();
    this.userId = userId;
    this.workDir = path.join(os.tmpdir(), 'sentinelops-scans', this.scanId);
    this.outputDir = path.join(this.workDir, 'output');
  }

  async run() {
    try {
      await this.log('init', 'Initializing SentinelOps recon engine...');
      await this.updateScan({ status: 'running', startedAt: new Date(), progress: 0 });

      let rawResults = {};
      let findings = [];

      if (this.scan.scanType === 'white-box') {
        await this.log('init', 'Initiating white-box source code review pipeline...');
        await this.updateScan({ progress: 10 });
        findings = await this.runWhiteboxPipeline();
      } else {
        // Run Python recon engine
        rawResults = await this.runPythonRecon();

        // AI analysis of results
        await this.log('ai', '🤖 Analyzing findings with SentinelOps AI...');
        await this.updateScan({ progress: 85 });
        findings = await analyzeResults(rawResults, this.scan);
      }

      // Create issues in the Issues collection
      await this.log('issues', `Creating ${findings.length} issue records...`);
      await this.updateScan({ progress: 92 });
      await this.createIssues(findings);

      // Finalize
      const startedAt = (await Scan.findById(this.scanId))?.startedAt || new Date();
      const duration = Math.round((Date.now() - startedAt.getTime()) / 1000);

      await this.updateScan({
        status: 'completed',
        completedAt: new Date(),
        progress: 100,
        duration,
        findings: findings.map(f => ({ ...f, foundAt: new Date() })),
        reconData: rawResults,
        toolsUsed: [
          { name: 'python-recon-engine', version: '1.0' },
          { name: 'subdomain-enum', version: '1.0' },
          { name: 'port-scanner', version: '1.0' },
          { name: 'dir-bruteforce', version: '1.0' },
          { name: 'endpoint-extractor', version: '1.0' },
          { name: 'gemini-ai', version: '2.5-flash' }
        ],
      });

      // Auto-generate report
      try {
        await this.log('report', '📄 Generating automated security report...');
        const { generateReportInternal } = require('../controllers/reportController');
        await generateReportInternal(this.scanId, 'technical', this.userId);
      } catch (e) {
        console.error('Report generation failed (non-fatal):', e.message);
      }

      await this.log('done', `✅ Scan completed in ${duration}s. ${findings.length} findings.`);
    } catch (err) {
      console.error(`Scan ${this.scanId} failed:`, err);
      await this.log('error', `Scan failed: ${err.message}`);
      await this.updateScan({ status: 'failed', progress: 0 });
    }
  }

  // ─── Python Reconnaissance Engine ────────────────────────────────
  async runPythonRecon() {
    const targets = (this.scan.targets || []).map(t => t.value).filter(Boolean);
    const target = targets[0] || '';
    if (!target) throw new Error('No target provided');

    // Prepare output directory
    fs.mkdirSync(this.outputDir, { recursive: true });

    await this.log('recon', `🐍 Launching Python recon engine against ${target}...`);
    await this.updateScan({ progress: 10 });

    const scriptPath = path.join(__dirname, 'native_recon.py');

    // Find python executable (try python3 first, then python)
    const pythonCmd = await this.findPython();

    return new Promise((resolve, reject) => {
      const proc = spawn(pythonCmd, [scriptPath, target, '-o', this.outputDir], {
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: true,
      });

      let stderr = '';
      let lastPhase = '';

      // Parse stdout for progress updates
      proc.stdout.on('data', async (data) => {
        const lines = data.toString().split('\n').filter(Boolean);
        for (const line of lines) {
          if (line.startsWith('[*]')) {
            const msg = line.replace('[*] ', '').trim();
            // Map python output to progress percentage
            let progress = 15;
            if (msg.includes('subdomains')) { progress = 20; lastPhase = 'subdomain-enum'; }
            else if (msg.includes('live hosts')) { progress = 35; lastPhase = 'http-probe'; }
            else if (msg.includes('ports')) { progress = 50; lastPhase = 'port-scan'; }
            else if (msg.includes('directories') || msg.includes('Bruteforcing')) { progress = 60; lastPhase = 'dir-bruteforce'; }
            else if (msg.includes('endpoints') || msg.includes('Extracting')) { progress = 70; lastPhase = 'endpoint-extract'; }
            else if (msg.includes('complete')) { progress = 80; lastPhase = 'recon-done'; }

            await this.log(lastPhase || 'recon', msg);
            await this.updateScan({ progress });
          }
        }
      });

      proc.stderr.on('data', (d) => { stderr += d.toString(); });

      const timeout = setTimeout(() => {
        try { proc.kill(); } catch {}
        reject(new Error('Python recon timed out after 10 minutes'));
      }, SCAN_TIMEOUT);

      proc.on('close', async (code) => {
        clearTimeout(timeout);
        if (code === 0) {
          const results = this.readPythonResults();
          resolve(results);
        } else {
          reject(new Error(`Python recon exited with code ${code}: ${stderr.slice(-500)}`));
        }
      });

      proc.on('error', (err) => {
        clearTimeout(timeout);
        reject(new Error(`Failed to start Python: ${err.message}. Make sure Python 3 is installed.`));
      });
    });
  }

  // Find a working Python command
  async findPython() {
    const candidates = ['python', 'python3', 'py'];
    for (const cmd of candidates) {
      try {
        const { execSync } = require('child_process');
        execSync(`${cmd} --version`, { stdio: 'pipe', timeout: 3000 });
        return cmd;
      } catch {}
    }
    throw new Error('Python 3 not found. Install Python 3 and ensure it is in your PATH.');
  }

  // Read the JSON results written by the Python script
  readPythonResults() {
    try {
      const files = fs.readdirSync(this.outputDir);
      const resultFile = files.find(f => f.startsWith('recon_') && f.endsWith('.json'));

      if (resultFile) {
        const fullPath = path.join(this.outputDir, resultFile);
        const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

        // Map python recon engine output to analyzer's expected format
        return {
          subdomains: data.subdomains || [],
          liveHosts: (data.urls || []).filter(u => u.status_code),
          ports: data.ports || [],
          directories: data.directories || [],
          endpoints: data.urls || [],
          jsFiles: (data.urls || []).filter(u => u.url && u.url.endsWith('.js')).map(u => u.url),
          sqliResults: [],
          nucleiResults: data.vulnerabilities || [],
          headers: this.extractHeaders(data),
          summary: {
            subdomainCount: (data.subdomains || []).length,
            liveHostCount: (data.urls || []).filter(u => u.status_code).length,
            openPortCount: (data.ports || []).length,
            directoryCount: (data.directories || []).length,
            endpointCount: (data.urls || []).length,
            jsFileCount: (data.urls || []).filter(u => u.url && u.url.endsWith('.js')).length,
          },
        };
      }
    } catch (err) {
      console.error('Failed to parse Python recon results:', err);
    }

    return {
      subdomains: [], liveHosts: [], ports: [], directories: [],
      endpoints: [], jsFiles: [], sqliResults: [], nucleiResults: [],
      headers: { missing_headers: [], present_headers: [] },
    };
  }

  // Extract security headers from the Python recon data
  extractHeaders(data) {
    const securityHeaderNames = [
      'strict-transport-security', 'content-security-policy',
      'x-content-type-options', 'x-frame-options', 'x-xss-protection',
      'referrer-policy', 'permissions-policy'
    ];

    // The first live host's headers (if any URL probe captured headers)
    // The Python script doesn't store per-host headers in the urls array,
    // but we can probe the main target to get them
    return { missing_headers: securityHeaderNames, present_headers: [] };
  }

  // ─── White-Box Pipeline ──────────────────────────────────────────
  async runWhiteboxPipeline() {
    const targets = (this.scan.targets || []).map(t => t.value).filter(Boolean);
    const target = targets[0] || '';
    if (!target) throw new Error('No repository or PR URL provided');

    let allFindings = [];

    // Check if it's a GitHub Pull Request URL
    const prMatch = target.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/);
    if (prMatch) {
      const [_, owner, repo, prNum] = prMatch;
      await this.log('github', `Fetching PR #${prNum} diff for ${owner}/${repo}...`);
      await this.updateScan({ progress: 30 });

      try {
        const diffUrl = `https://patch-diff.githubusercontent.com/raw/${owner}/${repo}/pull/${prNum}.diff`;
        const res = await fetch(diffUrl);
        if (!res.ok) throw new Error(`Failed to fetch PR diff: ${res.statusText}`);
        const diffText = await res.text();

        await this.log('ai', '🤖 Analyzing PR diff for security vulnerabilities...');
        await this.updateScan({ progress: 60 });

        const rawFindings = await reviewPRDiff(diffText, `${owner}/${repo}`);
        allFindings = (rawFindings || []).map(f => ({
          severity: f.severity || 'medium',
          title: f.title || 'PR Security Issue',
          description: f.description || '',
          location: f.file || f.location || '',
          evidence: f.evidence || '',
          remediation: f.fix || f.remediation || '',
          cwe: f.cwe || '',
          owasp: f.owasp || '',
          category: 'code-review',
        }));
        await this.log('done', `PR analysis complete. Found ${allFindings.length} potential issues.`);
      } catch (e) {
        throw new Error(`White-box PR review failed: ${e.message}`);
      }
    } else {
      // GitHub repo URL → fetch and analyze code files
      const repoMatch = target.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (repoMatch) {
        const [_, owner, repo] = repoMatch;
        await this.log('github', `Fetching repository ${owner}/${repo} for code review...`);
        await this.updateScan({ progress: 20 });

        try {
          const token = process.env.GITHUB_TOKEN;
          const headers = { 'User-Agent': 'SentinelOps', 'Accept': 'application/vnd.github.v3+json' };
          if (token) headers['Authorization'] = `Bearer ${token}`;

          const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`, { headers });
          if (!treeRes.ok) throw new Error('Failed to fetch repo tree');
          const tree = await treeRes.json();

          const codeExts = ['.js', '.py', '.ts', '.jsx', '.tsx', '.php', '.rb', '.java', '.go'];
          const codeFiles = (tree.tree || [])
            .filter(f => f.type === 'blob' && codeExts.some(ext => f.path.endsWith(ext)))
            .filter(f => !f.path.includes('node_modules') && !f.path.includes('vendor') && !f.path.includes('.min.'))
            .slice(0, 5);

          await this.log('github', `Found ${codeFiles.length} code files to analyze...`);
          await this.updateScan({ progress: 40 });

          for (let i = 0; i < codeFiles.length; i++) {
            const file = codeFiles[i];
            try {
              const contentRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`, { headers });
              if (!contentRes.ok) continue;
              const contentData = await contentRes.json();
              const code = Buffer.from(contentData.content || '', 'base64').toString('utf-8');

              const ext = path.extname(file.path).slice(1);
              const fileFindings = await analyzeCode(code, ext, file.path);
              allFindings.push(...fileFindings);

              await this.log('ai', `Analyzed ${file.path}: ${fileFindings.length} issues`);
              await this.updateScan({ progress: 40 + Math.round(((i + 1) / codeFiles.length) * 40) });
            } catch { /* skip unanalyzable files */ }
          }
        } catch (e) {
          throw new Error(`Repository code review failed: ${e.message}`);
        }
      } else {
        throw new Error('Invalid target for white-box scan. Provide a GitHub repository or PR URL.');
      }
    }

    return allFindings;
  }

  // ─── Issue Creation ──────────────────────────────────────────────
  async createIssues(findings) {
    const mongoose = require('mongoose');
    for (const f of findings) {
      try {
        await Issue.create({
          userId:      new mongoose.Types.ObjectId(this.userId),
          scanId:      new mongoose.Types.ObjectId(this.scanId),
          title:       f.title,
          severity:    f.severity,
          status:      'open',
          description: f.description,
          location:    f.location,
          evidence:    f.evidence,
          remediation: f.remediation,
          cwe:         f.cwe,
          owasp:       f.owasp,
          category:    f.category || 'security',
          cvss:        f.cvss || null,
          source:      'gemini-ai',
        });
      } catch (err) {
        console.error('Failed to create issue:', err.message);
      }
    }
  }

  // ─── Helpers ─────────────────────────────────────────────────────
  async updateScan(updates) {
    try { await Scan.findByIdAndUpdate(this.scanId, updates); } catch {}
  }

  async log(phase, message) {
    const entry = { timestamp: new Date(), phase, message, level: 'info' };
    try {
      await Scan.findByIdAndUpdate(this.scanId, { $push: { logs: entry } });
    } catch {}
    console.log(`[Scan ${this.scanId.slice(-6)}] [${phase}] ${message}`);
  }
}

module.exports = ScanOrchestrator;
