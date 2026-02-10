const Report = require('../models/Report');
const Scan = require('../models/Scan');
const Issue = require('../models/Issue');
const { generateContent } = require('../services/gemini');
const fs = require('fs');
const path = require('path');
const os = require('os');

const REPORTS_DIR = path.join(os.tmpdir(), 'sentinelops-reports');
if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

exports.listReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('-content')
      .limit(50);
    res.json({ reports });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReport = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, userId: req.user.id });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const { scanId, type = 'technical' } = req.body;
    if (!scanId) return res.status(400).json({ message: 'scanId required' });

    const report = await generateReportInternal(scanId, type, req.user.id);
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.generateReportInternal = generateReportInternal;

async function generateReportInternal(scanId, type, userId) {
  const scan = await Scan.findOne({ _id: scanId, userId });
  if (!scan) throw new Error('Scan not found');

  // Try to get issues from the Issues collection first
  let issues = await Issue.find({ scanId: scanId }).lean();
  
  // Fallback: if no issues in collection, use findings from the scan document
  if (issues.length === 0 && scan.findings?.length > 0) {
    issues = scan.findings.map(f => ({
      title: f.title,
      severity: f.severity,
      status: 'open',
      description: f.description,
      location: f.location,
      evidence: f.evidence,
      remediation: f.remediation,
      cwe: f.cwe,
      owasp: f.owasp,
      cvss: f.cvss,
      category: f.category || 'security',
    }));
  }

  // Create report record
  const report = await Report.create({
    userId,
    scanId,
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report — ${scan.name}`,
    type,
    status: 'generating',
    target: (scan.targets || []).map(t => t.value).join(', '),
    scanType: scan.scanType,
    findingsCount: issues.length,
    severityCounts: countSeverities(issues),
    toolsUsed: (scan.toolsUsed || []).map(t => t.name),
  });

  // Link report to scan
  await Scan.findByIdAndUpdate(scanId, { reportId: report._id });

  // Generate in background
  generateReportContent(report, scan, issues).catch(err => {
    console.error('Report generation failed:', err);
    Report.findByIdAndUpdate(report._id, { status: 'failed' }).catch(() => {});
  });

  return report;
}

exports.downloadReport = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, userId: req.user.id });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    if (report.status !== 'ready') return res.status(400).json({ message: 'Report still generating' });

    // Return HTML content that can be rendered as PDF by the browser
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="sentinel-report-${report._id}.html"`);
    res.send(report.content);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Background report generation ──

async function generateReportContent(report, scan, issues) {
  const target = (scan.targets || []).map(t => t.value).join(', ');
  const sevCounts = countSeverities(issues);

  let aiSummary = '';
  try {
    aiSummary = await generateContent(`
You are a senior penetration testing consultant writing a professional security report.

Target: ${target}
Scan type: ${scan.scanType}
Total findings: ${issues.length}
Critical: ${sevCounts.critical}, High: ${sevCounts.high}, Medium: ${sevCounts.medium}, Low: ${sevCounts.low}, Info: ${sevCounts.info}

Findings:
${issues.slice(0, 30).map(i => `- [${i.severity.toUpperCase()}] ${i.title}: ${i.description?.slice(0, 200)}`).join('\n')}

Write an executive summary paragraph (3-4 sentences), a risk assessment paragraph, and a recommendations paragraph. Professional tone.
Return ONLY the text, no JSON, no markdown headers.`, 'gemini-2.0-flash');
  } catch {
    aiSummary = 'Executive summary generation unavailable.';
  }

  const html = buildReportHTML({
    report,
    scan,
    issues,
    target,
    sevCounts,
    aiSummary,
  });

  await Report.findByIdAndUpdate(report._id, {
    status: 'ready',
    content: html,
    generatedAt: new Date(),
  });
}

function buildReportHTML({ report, scan, issues, target, sevCounts, aiSummary }) {
  const findingsHTML = issues.map((issue, idx) => `
    <div class="finding ${issue.severity}">
      <div class="finding-header">
        <span class="badge badge-${issue.severity}">${issue.severity.toUpperCase()}</span>
        <h3>${idx + 1}. ${escHtml(issue.title)}</h3>
      </div>
      <table class="finding-meta">
        <tr><td><strong>CWE:</strong></td><td>${escHtml(issue.cwe || 'N/A')}</td></tr>
        <tr><td><strong>OWASP:</strong></td><td>${escHtml(issue.owasp || 'N/A')}</td></tr>
        <tr><td><strong>Location:</strong></td><td>${escHtml(issue.location || 'N/A')}</td></tr>
        <tr><td><strong>Status:</strong></td><td>${escHtml(issue.status)}</td></tr>
        ${issue.cvss ? `<tr><td><strong>CVSS:</strong></td><td>${issue.cvss}</td></tr>` : ''}
      </table>
      <h4>Description</h4>
      <p>${escHtml(issue.description || '')}</p>
      ${issue.evidence ? `<h4>Evidence</h4><pre>${escHtml(issue.evidence)}</pre>` : ''}
      ${issue.remediation ? `<h4>Remediation</h4><p>${escHtml(issue.remediation)}</p>` : ''}
    </div>
  `).join('');

  const reconSummaryHTML = scan.reconData?.summary ? `
    <div class="recon-summary">
      <h2>Reconnaissance Summary</h2>
      <div class="stats-grid">
        <div class="stat"><span class="stat-value">${scan.reconData.summary.subdomainCount || 0}</span><span class="stat-label">Subdomains</span></div>
        <div class="stat"><span class="stat-value">${scan.reconData.summary.liveHostCount || 0}</span><span class="stat-label">Live Hosts</span></div>
        <div class="stat"><span class="stat-value">${scan.reconData.summary.openPortCount || 0}</span><span class="stat-label">Open Ports</span></div>
        <div class="stat"><span class="stat-value">${scan.reconData.summary.directoryCount || 0}</span><span class="stat-label">Directories</span></div>
        <div class="stat"><span class="stat-value">${scan.reconData.summary.endpointCount || 0}</span><span class="stat-label">Endpoints</span></div>
        <div class="stat"><span class="stat-value">${scan.reconData.summary.jsFileCount || 0}</span><span class="stat-label">JS Files</span></div>
      </div>
    </div>
  ` : '';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${escHtml(report.title)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #fff; color: #1a1a2e; line-height: 1.6; }
  .container { max-width: 900px; margin: 0 auto; padding: 40px; }
  .cover { text-align: center; padding: 80px 40px; background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%); color: #fff; margin: -40px -40px 40px; }
  .cover h1 { font-size: 32px; margin-bottom: 8px; }
  .cover .subtitle { color: #8888aa; font-size: 16px; }
  .cover .meta { margin-top: 30px; color: #6666aa; font-size: 14px; }
  .section { margin-bottom: 40px; }
  h2 { font-size: 22px; color: #1a1a3e; border-bottom: 2px solid #3366ff; padding-bottom: 8px; margin-bottom: 20px; }
  .executive-summary { background: #f8f9ff; border-left: 4px solid #3366ff; padding: 20px; border-radius: 4px; }
  .severity-chart { display: flex; gap: 16px; margin: 20px 0; }
  .severity-box { flex: 1; padding: 16px; border-radius: 8px; text-align: center; color: #fff; }
  .severity-box.critical { background: #dc2626; }
  .severity-box.high { background: #ea580c; }
  .severity-box.medium { background: #d97706; }
  .severity-box.low { background: #2563eb; }
  .severity-box.info { background: #6b7280; }
  .severity-box .count { font-size: 28px; font-weight: bold; }
  .severity-box .label { font-size: 12px; text-transform: uppercase; opacity: 0.9; }
  .finding { border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 20px; padding: 20px; }
  .finding.critical { border-left: 4px solid #dc2626; }
  .finding.high { border-left: 4px solid #ea580c; }
  .finding.medium { border-left: 4px solid #d97706; }
  .finding.low { border-left: 4px solid #2563eb; }
  .finding.info { border-left: 4px solid #6b7280; }
  .finding-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .finding-header h3 { font-size: 16px; }
  .badge { padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; color: #fff; }
  .badge-critical { background: #dc2626; }
  .badge-high { background: #ea580c; }
  .badge-medium { background: #d97706; }
  .badge-low { background: #2563eb; }
  .badge-info { background: #6b7280; }
  .finding-meta { width: 100%; margin-bottom: 12px; font-size: 14px; }
  .finding-meta td { padding: 4px 12px 4px 0; }
  h4 { font-size: 14px; color: #374151; margin: 12px 0 6px; }
  pre { background: #f3f4f6; padding: 12px; border-radius: 4px; font-size: 13px; overflow-x: auto; white-space: pre-wrap; }
  .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .stat { background: #f8f9ff; padding: 16px; border-radius: 8px; text-align: center; }
  .stat-value { display: block; font-size: 24px; font-weight: bold; color: #3366ff; }
  .stat-label { font-size: 12px; color: #6b7280; }
  .tools-list { display: flex; flex-wrap: wrap; gap: 8px; }
  .tool-tag { background: #e5e7ff; color: #3366ff; padding: 4px 12px; border-radius: 20px; font-size: 13px; }
  .footer { text-align: center; padding: 30px; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; margin-top: 40px; }
  @media print { .container { max-width: 100%; } .cover { break-after: page; } }
</style>
</head>
<body>
<div class="container">
  <div class="cover">
    <h1>🛡️ ${escHtml(report.title)}</h1>
    <p class="subtitle">SentinelOps — AI-Powered Penetration Testing Report</p>
    <div class="meta">
      <p>Target: ${escHtml(target)}</p>
      <p>Scan Type: ${scan.scanType} | Date: ${new Date().toLocaleDateString()}</p>
      <p>Classification: CONFIDENTIAL</p>
    </div>
  </div>

  <div class="section">
    <h2>Executive Summary</h2>
    <div class="executive-summary"><p>${escHtml(aiSummary)}</p></div>
  </div>

  <div class="section">
    <h2>Vulnerability Overview</h2>
    <div class="severity-chart">
      <div class="severity-box critical"><span class="count">${sevCounts.critical}</span><span class="label">Critical</span></div>
      <div class="severity-box high"><span class="count">${sevCounts.high}</span><span class="label">High</span></div>
      <div class="severity-box medium"><span class="count">${sevCounts.medium}</span><span class="label">Medium</span></div>
      <div class="severity-box low"><span class="count">${sevCounts.low}</span><span class="label">Low</span></div>
      <div class="severity-box info"><span class="count">${sevCounts.info}</span><span class="label">Info</span></div>
    </div>
  </div>

  ${reconSummaryHTML}

  <div class="section">
    <h2>Methodology</h2>
    <p>This assessment followed the <strong>Jason Haddix Bug Hunter's Methodology</strong> and was conducted using an automated pipeline of industry-standard security tools, with results analyzed by Gemini AI.</p>
    <h4>Tools Used</h4>
    <div class="tools-list">
      ${(scan.toolsUsed || []).map(t => `<span class="tool-tag">${escHtml(t.name)}</span>`).join('')}
    </div>
  </div>

  <div class="section">
    <h2>Detailed Findings (${issues.length})</h2>
    ${findingsHTML || '<p>No vulnerabilities identified.</p>'}
  </div>

  <div class="footer">
    <p>Generated by SentinelOps — AI-Powered Security Platform</p>
    <p>${new Date().toISOString()}</p>
  </div>
</div>
</body>
</html>`;
}

function countSeverities(issues) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
  issues.forEach(i => { if (counts[i.severity] !== undefined) counts[i.severity]++; });
  return counts;
}

function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
