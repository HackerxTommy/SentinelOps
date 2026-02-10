const Vulnerability = require('../models/Vulnerability');
const ScanSession = require('../models/ScanSession');
const { runPython } = require('../services/pythonRunner');
const { cloneRepo, cleanupRepo } = require('../services/repoService');

// POST /api/whitebox/repo/scan
exports.scanRepo = async (req, res) => {
  const { repoUrl, githubToken } = req.body;
  if (!repoUrl) return res.status(400).json({ message: 'repoUrl is required' });

  const session = await ScanSession.create({ userId: req.user.id, type: 'repo-scan', target: repoUrl });
  let repoPath;

  try {
    repoPath = cloneRepo(repoUrl, githubToken || process.env.GITHUB_TOKEN);
    const startTime = Date.now();
    const result = await runPython('code_scanner.py', ['--path', repoPath]);
    const duration = Math.round((Date.now() - startTime) / 1000);

    const vulns = result.data?.vulnerabilities || [];
    const saved = [];
    for (const v of vulns) {
      const doc = await Vulnerability.create({
        userId: req.user.id,
        scanSessionId: session._id,
        file: v.file,
        line: v.line || 0,
        type: v.type,
        severity: v.severity || 'medium',
        description: v.description || '',
        code_snippet: v.code_snippet || '',
        patched_code: v.patched_code || '',
        source: 'repo-scan',
      });
      saved.push(doc);
    }

    await ScanSession.findByIdAndUpdate(session._id, {
      status: 'completed', filesScanned: result.data?.files_scanned || 0,
      vulnCount: saved.length, duration,
    });

    res.json({ sessionId: session._id, filesScanned: result.data?.files_scanned || 0, vulnerabilities: saved });
  } catch (err) {
    await ScanSession.findByIdAndUpdate(session._id, { status: 'failed', error: err.message });
    res.status(500).json({ message: err.message });
  } finally {
    if (repoPath) cleanupRepo(repoPath);
  }
};

// POST /api/whitebox/repo/scan-local
exports.scanLocal = async (req, res) => {
  const { localPath } = req.body;
  if (!localPath) return res.status(400).json({ message: 'localPath is required' });

  const session = await ScanSession.create({ userId: req.user.id, type: 'local-scan', target: localPath });

  try {
    const startTime = Date.now();
    const result = await runPython('code_scanner.py', ['--path', localPath]);
    const duration = Math.round((Date.now() - startTime) / 1000);

    const vulns = result.data?.vulnerabilities || [];
    const saved = [];
    for (const v of vulns) {
      const doc = await Vulnerability.create({
        userId: req.user.id, scanSessionId: session._id,
        file: v.file, line: v.line || 0, type: v.type, severity: v.severity || 'medium',
        description: v.description || '', code_snippet: v.code_snippet || '',
        patched_code: v.patched_code || '', source: 'repo-scan',
      });
      saved.push(doc);
    }

    await ScanSession.findByIdAndUpdate(session._id, {
      status: 'completed', filesScanned: result.data?.files_scanned || 0,
      vulnCount: saved.length, duration,
    });

    res.json({ sessionId: session._id, filesScanned: result.data?.files_scanned || 0, vulnerabilities: saved });
  } catch (err) {
    await ScanSession.findByIdAndUpdate(session._id, { status: 'failed', error: err.message });
    res.status(500).json({ message: err.message });
  }
};

// POST /api/whitebox/pr/review
exports.reviewPR = async (req, res) => {
  const { repoUrl, prNumber, githubToken } = req.body;
  if (!repoUrl || !prNumber) return res.status(400).json({ message: 'repoUrl and prNumber are required' });

  const session = await ScanSession.create({ userId: req.user.id, type: 'pr-review', target: `${repoUrl}#${prNumber}` });

  try {
    const token = githubToken || process.env.GITHUB_TOKEN || '';
    const startTime = Date.now();
    const args = ['--repo-url', repoUrl, '--pr-number', String(prNumber)];
    if (token) args.push('--github-token', token);
    const result = await runPython('pr_scanner.py', args);
    const duration = Math.round((Date.now() - startTime) / 1000);

    const vulns = result.data?.vulnerabilities || [];
    const saved = [];
    for (const v of vulns) {
      const doc = await Vulnerability.create({
        userId: req.user.id, scanSessionId: session._id,
        file: v.file, line: v.line || 0, type: v.type, severity: v.severity || 'medium',
        description: v.description || '', code_snippet: v.code_snippet || '',
        patched_code: v.patched_code || '', source: 'pr-review',
      });
      saved.push(doc);
    }

    await ScanSession.findByIdAndUpdate(session._id, {
      status: 'completed', filesScanned: result.data?.files_scanned || 0,
      vulnCount: saved.length, duration,
    });

    res.json({ sessionId: session._id, filesScanned: result.data?.files_scanned || 0, vulnerabilities: saved });
  } catch (err) {
    await ScanSession.findByIdAndUpdate(session._id, { status: 'failed', error: err.message });
    res.status(500).json({ message: err.message });
  }
};

// GET /api/whitebox/vulnerabilities?status=open
exports.listVulnerabilities = async (req, res) => {
  try {
    const filter = { userId: req.user.id };
    if (req.query.status) filter.status = req.query.status;
    const vulns = await Vulnerability.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json(vulns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/whitebox/dashboard/stats
exports.dashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const all = await Vulnerability.find({ userId });
    const stats = { critical: 0, high: 0, medium: 0, low: 0, info: 0, total: all.length, open: 0, fixed: 0 };
    all.forEach(v => {
      if (stats[v.severity] !== undefined) stats[v.severity]++;
      if (v.status === 'open') stats.open++;
      if (v.status === 'fixed') stats.fixed++;
    });
    const sessions = await ScanSession.find({ userId }).sort({ createdAt: -1 }).limit(10);
    res.json({ stats, recentScans: sessions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/whitebox/report
exports.downloadReport = async (req, res) => {
  try {
    const vulns = await Vulnerability.find({ userId: req.user.id }).sort({ severity: 1, createdAt: -1 });
    const sessions = await ScanSession.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const report = {
      generatedAt: new Date().toISOString(),
      totalVulnerabilities: vulns.length,
      bySeverity: { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
      byStatus: { open: 0, fixed: 0, 'false-positive': 0 },
      scanSessions: sessions.map(s => ({ type: s.type, target: s.target, status: s.status, filesScanned: s.filesScanned, vulnCount: s.vulnCount, date: s.createdAt })),
      vulnerabilities: vulns.map(v => ({
        file: v.file, line: v.line, type: v.type, severity: v.severity,
        description: v.description, code_snippet: v.code_snippet,
        patched_code: v.patched_code, status: v.status, foundAt: v.createdAt,
      })),
    };
    vulns.forEach(v => {
      if (report.bySeverity[v.severity] !== undefined) report.bySeverity[v.severity]++;
      if (report.byStatus[v.status] !== undefined) report.byStatus[v.status]++;
    });
    res.setHeader('Content-Disposition', 'attachment; filename="sentinelops-whitebox-report.json"');
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/whitebox/audit-report
exports.auditReport = async (req, res) => {
  try {
    const vulns = await Vulnerability.find({ userId: req.user.id, patched_code: { $ne: '' } }).sort({ severity: 1, createdAt: -1 });
    const auditItems = vulns.map(v => ({
      id: v._id,
      file: v.file,
      line: v.line,
      type: v.type,
      severity: v.severity,
      status: v.status,
      original_code: v.code_snippet,
      patched_code: v.patched_code,
      description: v.description,
      foundAt: v.createdAt,
    }));
    res.json(auditItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/whitebox/vulnerabilities/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['open', 'fixed', 'false-positive'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use: open, fixed, false-positive' });
    }
    const vuln = await Vulnerability.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status },
      { new: true }
    );
    if (!vuln) return res.status(404).json({ message: 'Vulnerability not found' });
    res.json(vuln);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
