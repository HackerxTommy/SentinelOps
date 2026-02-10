const Issue = require('../models/Issue');
const { generateAutoFix } = require('../engine/ai/analyzer');

exports.listIssues = async (req, res) => {
  try {
    const { status, severity, scanId, category } = req.query;
    const filter = { userId: req.user.id };
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (scanId) filter.scanId = scanId;
    if (category) filter.category = category;

    const issues = await Issue.find(filter)
      .sort({ severity: 1, createdAt: -1 })
      .populate('scanId', 'name scanType')
      .limit(200);
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getIssue = async (req, res) => {
  try {
    const issue = await Issue.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('scanId', 'name scanType targets');
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateIssue = async (req, res) => {
  try {
    const allowed = ['status', 'assignee', 'priority', 'comments'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const issue = await Issue.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updates,
      { new: true }
    );
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text required' });

    const issue = await Issue.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $push: { comments: { author: req.user.id, text, createdAt: new Date() } } },
      { new: true }
    );
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const all = await Issue.find({ userId });

    const bySeverity = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    const byStatus = { open: 0, triaged: 0, 'in-progress': 0, resolved: 0, 'false-positive': 0, 'accepted-risk': 0 };
    const byCategory = {};

    all.forEach(i => {
      if (bySeverity[i.severity] !== undefined) bySeverity[i.severity]++;
      if (byStatus[i.status] !== undefined) byStatus[i.status]++;
      byCategory[i.category] = (byCategory[i.category] || 0) + 1;
    });

    res.json({
      total: all.length,
      bySeverity,
      byStatus,
      byCategory,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.requestAutoFix = async (req, res) => {
  try {
    const issue = await Issue.findOne({ _id: req.params.id, userId: req.user.id });
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const { code } = req.body; // client sends the vulnerable code snippet
    if (!code) return res.status(400).json({ message: 'Code snippet required for auto-fix' });

    const fixedCode = await generateAutoFix(issue, code);
    if (!fixedCode) return res.status(500).json({ message: 'Auto-fix generation failed' });

    issue.autoFix = { available: true, fixedCode, appliedAt: null };
    await issue.save();

    res.json({ fixedCode, issue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { issueIds, status } = req.body;
    if (!issueIds?.length || !status) {
      return res.status(400).json({ message: 'issueIds and status are required' });
    }

    await Issue.updateMany(
      { _id: { $in: issueIds }, userId: req.user.id },
      { status }
    );

    res.json({ message: `${issueIds.length} issues updated to ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
