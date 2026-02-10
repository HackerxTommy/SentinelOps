const Scan = require('../models/Scan');
const Issue = require('../models/Issue');
const ScanOrchestrator = require('../engine/orchestrator');
const { generateContent } = require('../services/gemini');

exports.listScans = async (req, res) => {
  try {
    const scans = await Scan.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('-findings -reconData')
      .limit(50);
    res.json(scans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getScan = async (req, res) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id, userId: req.user.id });
    if (!scan) return res.status(404).json({ message: 'Scan not found' });
    res.json(scan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFindings = async (req, res) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id, userId: req.user.id }).select('findings');
    if (!scan) return res.status(404).json({ message: 'Scan not found' });
    res.json(scan.findings || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id, userId: req.user.id }).select('logs status progress');
    if (!scan) return res.status(404).json({ message: 'Scan not found' });
    res.json({ logs: scan.logs || [], status: scan.status, progress: scan.progress });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReconData = async (req, res) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id, userId: req.user.id }).select('reconData');
    if (!scan) return res.status(404).json({ message: 'Scan not found' });
    res.json(scan.reconData || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createScan = async (req, res) => {
  try {
    const { name, scanType, targets, access, context, schedule } = req.body;

    const scan = new Scan({
      userId: req.user.id,
      name: name || `Pentest - ${new Date().toLocaleDateString()}`,
      scanType: scanType || 'black-box',
      targets: targets || [],
      access: access || {},
      context: context || {},
      schedule: schedule || { enabled: false },
      status: 'queued',
    });

    await scan.save();

    // Launch real scan pipeline in background (Docker-based)
    const orchestrator = new ScanOrchestrator(scan, req.user.id);
    orchestrator.run().catch(err => {
      console.error(`Scan ${scan._id} failed:`, err.message);
    });

    res.status(201).json(scan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelScan = async (req, res) => {
  try {
    const scan = await Scan.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id, status: { $in: ['queued', 'running'] } },
      { status: 'cancelled' },
      { new: true }
    );
    if (!scan) return res.status(404).json({ message: 'Scan not found or already completed' });

    // Try to kill the Docker container
    try {
      const { execSync } = require('child_process');
      execSync(`docker kill sentinel-scan-${req.params.id.slice(-8)}`, { stdio: 'pipe' });
    } catch { /* container may already be stopped */ }

    res.json(scan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteScan = async (req, res) => {
  try {
    await Scan.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    // Also delete associated issues
    await Issue.deleteMany({ scanId: req.params.id });
    res.json({ message: 'Scan deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const totalScans = await Scan.countDocuments({ userId });
    const activeScans = await Scan.countDocuments({ userId, status: 'running' });
    const completedScans = await Scan.countDocuments({ userId, status: 'completed' });

    // Aggregate issue counts by severity and status
    const issues = await Issue.find({ userId });
    const vuln = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    const statusCounts = { open: 0, triaged: 0, 'in-progress': 0, resolved: 0, 'false-positive': 0 };

    issues.forEach(i => {
      if (vuln[i.severity] !== undefined) vuln[i.severity]++;
      if (statusCounts[i.status] !== undefined) statusCounts[i.status]++;
    });

    res.json({
      totalScans,
      activeScans,
      completedScans,
      vulnerabilities: {
        ...vuln,
        total: vuln.critical + vuln.high + vuln.medium + vuln.low + vuln.info,
      },
      issueStatus: statusCounts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
