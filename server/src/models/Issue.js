const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scan' },
  title: { type: String, required: true },
  severity: { type: String, enum: ['critical', 'high', 'medium', 'low', 'info'], required: true },
  status: {
    type: String,
    enum: ['open', 'triaged', 'in-progress', 'resolved', 'false-positive', 'accepted-risk'],
    default: 'open',
  },
  category: { type: String, default: 'general' },
  description: String,
  location: String,
  evidence: String,
  remediation: String,
  cwe: String,
  owasp: String,
  cvss: Number,
  assignee: String,
  priority: { type: Number, default: 0 },

  // Auto-fix data (from Gemini)
  autoFix: {
    available: { type: Boolean, default: false },
    fixedCode: String,
    appliedAt: Date,
  },

  // Source (which tool / analysis found this)
  source: {
    type: String,
    enum: ['nuclei', 'sqlmap', 'nmap', 'dirsearch', 'katana', 'gemini-ai', 'code-review', 'pr-review', 'manual'],
    default: 'gemini-ai',
  },

  // Comments / activity
  comments: [{
    author: String,
    text: String,
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

issueSchema.index({ userId: 1, status: 1, severity: 1 });
issueSchema.index({ scanId: 1 });

module.exports = mongoose.model('Issue', issueSchema);
