/**
 * Gemini AI Vulnerability Analyzer
 *
 * Takes raw tool output from the scanner container and uses Gemini to:
 * 1. Correlate findings across tools
 * 2. Identify complex vulnerability patterns
 * 3. Generate severity ratings and remediation advice
 * 4. Check for OWASP Top 10, API Top 10, and LLM Top 10
 */
const { generateContent } = require('../../services/gemini');

const OWASP_TOP_10 = [
  'A01:2021 Broken Access Control',
  'A02:2021 Cryptographic Failures',
  'A03:2021 Injection',
  'A04:2021 Insecure Design',
  'A05:2021 Security Misconfiguration',
  'A06:2021 Vulnerable and Outdated Components',
  'A07:2021 Identification and Authentication Failures',
  'A08:2021 Software and Data Integrity Failures',
  'A09:2021 Security Logging and Monitoring Failures',
  'A10:2021 Server-Side Request Forgery (SSRF)',
];

const API_TOP_10 = [
  'API1:2023 Broken Object Level Authorization',
  'API2:2023 Broken Authentication',
  'API3:2023 Broken Object Property Level Authorization',
  'API4:2023 Unrestricted Resource Consumption',
  'API5:2023 Broken Function Level Authorization',
  'API6:2023 Unrestricted Access to Sensitive Business Flows',
  'API7:2023 Server Side Request Forgery',
  'API8:2023 Security Misconfiguration',
  'API9:2023 Improper Inventory Management',
  'API10:2023 Unsafe Consumption of APIs',
];

/**
 * Analyze raw scan results with Gemini AI.
 * Returns structured findings array.
 */
async function analyzeResults(rawResults, scanDoc) {
  const targetUrls = (scanDoc.targets || []).map(t => t.value).join(', ');

  // Build a concise summary of all tool outputs for the AI
  const reconSummary = buildReconSummary(rawResults);

  const prompt = `You are a senior penetration tester and cybersecurity researcher following Jason Haddix's "Bug Hunter's Methodology".

TARGET: ${targetUrls}
SCAN TYPE: ${scanDoc.scanType}

Below are the REAL reconnaissance results from automated tools (subfinder, httpx, nmap, dirsearch, ffuf, katana, sqlmap, nuclei).

${reconSummary}

INSTRUCTIONS:
1. Analyze ALL the data above as a senior pentester would.
2. Correlate findings across tools to identify attack chains.
3. Identify vulnerabilities matching these frameworks:
   - OWASP Top 10 (2021)
   - OWASP API Security Top 10 (2023)
   - OWASP LLM Top 10
4. For each vulnerability, determine real severity based on exploitability and impact.
5. Provide actionable remediation steps.

IMPORTANT: Only report REAL vulnerabilities supported by the evidence in the data above. Do NOT fabricate findings.

Return ONLY a JSON array. Each object must have these fields:
{
  "severity": "critical|high|medium|low|info",
  "title": "Short descriptive title",
  "description": "Detailed description of the vulnerability",
  "location": "Affected URL/endpoint/port",
  "evidence": "What tool data proves this vulnerability exists",
  "remediation": "Step-by-step fix instructions",
  "cwe": "CWE-XXX",
  "owasp": "OWASP category (e.g., A03:2021 Injection)",
  "category": "Category name (e.g., injection, misconfig, auth, crypto, info-disclosure)",
  "cvss": "Estimated CVSS score (0.0-10.0)"
}

Return 0 findings if none are real. No markdown wrapping — ONLY the JSON array.`;

  try {
    const aiResponse = await generateContent(prompt, 'gemini-2.5-flash');
    const cleaned = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
    const findings = JSON.parse(cleaned);

    // Validate and normalize each finding
    return findings.map(f => normalizeFinding(f)).filter(Boolean);
  } catch (err) {
    console.error('AI analysis failed:', err.message);
    // Fallback: convert nuclei results directly to findings
    return fallbackFindings(rawResults);
  }
}

/**
 * Analyze source code with Gemini for white-box testing.
 */
async function analyzeCode(code, language, filePath) {
  const prompt = `You are a senior application security engineer performing a white-box code review.

FILE: ${filePath}
LANGUAGE: ${language}

SOURCE CODE:
\`\`\`${language}
${code.slice(0, 15000)}
\`\`\`

Review this code for ALL security vulnerabilities including:
- SQL Injection, XSS, CSRF, SSRF, RCE, Path Traversal
- Insecure Deserialization, Hardcoded Secrets
- Broken Authentication/Authorization (IDOR)
- Cryptographic weaknesses
- Race conditions, business logic flaws
- OWASP Top 10, API Top 10

For each vulnerability found, return a JSON object with:
{
  "severity": "critical|high|medium|low|info",
  "title": "Vulnerability title",
  "description": "What the vulnerability is and why it's dangerous",
  "location": "file:line_number or function name",
  "evidence": "The vulnerable code snippet",
  "remediation": "How to fix it with example fixed code",
  "cwe": "CWE-XXX",
  "owasp": "OWASP category"
}

Return ONLY a JSON array. Return [] if no real vulnerabilities found.`;

  try {
    const response = await generateContent(prompt, 'gemini-2.5-flash');
    const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned).map(f => normalizeFinding(f)).filter(Boolean);
  } catch (err) {
    console.error('Code analysis failed:', err.message);
    return [];
  }
}

/**
 * Generate auto-fix for a vulnerability.
 */
async function generateAutoFix(vulnerability, code) {
  const prompt = `You are a senior security engineer. Fix this vulnerability:

VULNERABILITY: ${vulnerability.title}
SEVERITY: ${vulnerability.severity}
DESCRIPTION: ${vulnerability.description}
CWE: ${vulnerability.cwe}

VULNERABLE CODE:
\`\`\`
${code.slice(0, 8000)}
\`\`\`

Return ONLY the fixed code with inline comments explaining each change. No markdown wrapping.`;

  try {
    const response = await generateContent(prompt, 'gemini-2.5-flash');
    return response.replace(/```\w*\n?|\n?```/g, '').trim();
  } catch (err) {
    console.error('Auto-fix generation failed:', err.message);
    return null;
  }
}

/**
 * Review a PR diff for security issues.
 */
async function reviewPRDiff(diff, repoName) {
  const prompt = `You are a security-focused code reviewer. Review this pull request diff for security vulnerabilities.

REPOSITORY: ${repoName}

DIFF:
\`\`\`diff
${diff.slice(0, 20000)}
\`\`\`

Look for:
- New vulnerabilities introduced in added lines
- Security improvements in removed lines
- Missing input validation, authentication, or authorization
- Hardcoded secrets, SQL injection, XSS, CSRF
- Insecure configurations

Return a JSON array of findings:
{
  "severity": "critical|high|medium|low|info",
  "title": "Issue title",
  "file": "affected filename",
  "line": "line number in diff",
  "description": "What's wrong",
  "fix": "How to fix it"
}

Return [] if the diff is clean. No markdown wrapping — ONLY JSON array.`;

  try {
    const response = await generateContent(prompt, 'gemini-2.5-flash');
    const cleaned = response.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('PR review failed:', err.message);
    return [];
  }
}

// ── Helpers ──

function buildReconSummary(data) {
  const sections = [];

  if (data.subdomains?.length) {
    const list = data.subdomains.slice(0, 50).map(s => s.domain || s).join('\n');
    sections.push(`## SUBDOMAINS (${data.subdomains.length} found)\n${list}`);
  }

  if (data.liveHosts?.length) {
    const list = data.liveHosts.slice(0, 30).map(h =>
      `${h.url || h.input} [${h['status-code'] || h.status_code || '?'}] — ${h.title || 'no title'} | Tech: ${(h.tech || []).join(', ')}`
    ).join('\n');
    sections.push(`## LIVE HOSTS (${data.liveHosts.length} alive)\n${list}`);
  }

  if (data.ports?.length) {
    const list = data.ports.slice(0, 50).map(p =>
      `${p.host}:${p.port} — ${p.service} ${p.version || ''} (${p.state})`
    ).join('\n');
    sections.push(`## OPEN PORTS (${data.ports.length} found)\n${list}`);
  }

  if (data.directories?.length) {
    const list = data.directories.slice(0, 40).map(d =>
      `${d.url} [${d.status}] ${d.size || ''}`
    ).join('\n');
    sections.push(`## DISCOVERED DIRECTORIES (${data.directories.length} found)\n${list}`);
  }

  if (data.endpoints?.length) {
    const list = data.endpoints.slice(0, 40).map(e =>
      `${e.method || 'GET'} ${e.url}`
    ).join('\n');
    sections.push(`## CRAWLED ENDPOINTS (${data.endpoints.length} found)\n${list}`);
  }

  if (data.jsFiles?.length) {
    const list = data.jsFiles.slice(0, 20).join('\n');
    sections.push(`## JS FILES (${data.jsFiles.length} found)\n${list}`);
  }

  if (data.sqliResults?.length) {
    const list = data.sqliResults.map(s =>
      `Vulnerable: ${s.vulnerable} — ${(s.details || '').slice(0, 200)}`
    ).join('\n');
    sections.push(`## SQL INJECTION RESULTS\n${list}`);
  }

  if (data.nucleiResults?.length) {
    const list = data.nucleiResults.map(n =>
      `[${n.severity}] ${n.name} — ${n.matched || n.host} | Tags: ${(n.tags || []).join(',')}`
    ).join('\n');
    sections.push(`## NUCLEI VULNERABILITY SCAN (${data.nucleiResults.length} findings)\n${list}`);
  }

  if (data.headers) {
    const missing = (data.headers.missing_headers || []).join(', ');
    const present = (data.headers.present_headers || []).join(', ');
    sections.push(`## SECURITY HEADERS\nMissing: ${missing || 'none'}\nPresent: ${present || 'none'}`);
  }

  return sections.join('\n\n') || 'No reconnaissance data available.';
}

function normalizeFinding(f) {
  if (!f || !f.title) return null;
  const validSeverities = ['critical', 'high', 'medium', 'low', 'info'];
  return {
    severity: validSeverities.includes(f.severity?.toLowerCase()) ? f.severity.toLowerCase() : 'info',
    title: f.title,
    description: f.description || '',
    location: f.location || '',
    evidence: f.evidence || '',
    remediation: f.remediation || '',
    cwe: f.cwe || '',
    owasp: f.owasp || '',
    category: f.category || 'security',
    cvss: f.cvss ? parseFloat(f.cvss) : null,
  };
}

function fallbackFindings(rawResults) {
  const findings = [];

  // Convert nuclei results to findings directly
  if (rawResults.nucleiResults?.length) {
    for (const n of rawResults.nucleiResults) {
      findings.push(normalizeFinding({
        severity: n.severity || 'info',
        title: n.name || n.templateId,
        description: n.description || `Detected by nuclei template: ${n.templateId}`,
        location: n.matched || n.host,
        evidence: `Nuclei template match: ${n.templateId}`,
        remediation: '',
        cwe: n.cwe || '',
        category: 'vulnerability-scan',
      }));
    }
  }

  // Missing security headers
  if (rawResults.headers?.missing_headers?.length) {
    findings.push(normalizeFinding({
      severity: 'low',
      title: 'Missing Security Headers',
      description: `The following security headers are not configured: ${rawResults.headers.missing_headers.join(', ')}`,
      location: 'HTTP Response Headers',
      evidence: `Missing: ${rawResults.headers.missing_headers.join(', ')}`,
      remediation: 'Configure all recommended security headers: Strict-Transport-Security, Content-Security-Policy, X-Content-Type-Options, X-Frame-Options',
      cwe: 'CWE-693',
      owasp: 'A05:2021 Security Misconfiguration',
      category: 'misconfig',
    }));
  }

  // SQLi results
  if (rawResults.sqliResults?.some(s => s.vulnerable)) {
    for (const s of rawResults.sqliResults.filter(s => s.vulnerable)) {
      findings.push(normalizeFinding({
        severity: 'critical',
        title: 'SQL Injection Detected',
        description: 'sqlmap confirmed SQL injection vulnerability',
        location: s.file || 'detected by sqlmap',
        evidence: (s.details || '').slice(0, 500),
        remediation: 'Use parameterized queries / prepared statements. Never concatenate user input into SQL.',
        cwe: 'CWE-89',
        owasp: 'A03:2021 Injection',
        category: 'injection',
      }));
    }
  }

  return findings.filter(Boolean);
}

module.exports = { analyzeResults, analyzeCode, generateAutoFix, reviewPRDiff };
