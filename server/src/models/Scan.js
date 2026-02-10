const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'Untitled Scan' },
  scanType: { type: String, enum: ['black-box', 'white-box', 'grey-box'], default: 'black-box' },
  status: { type: String, enum: ['queued', 'running', 'completed', 'failed', 'cancelled'], default: 'queued' },
  targets: [{
    type: { type: String, enum: ['domain', 'api', 'repository', 'upload'], default: 'domain' },
    value: String,
  }],
  access: {
    credentials: [{ username: String, password: String, notes: String }],
    headers: [{ name: String, value: String, notes: String }],
  },
  context: {
    threats: String,
    focus: String,
    additional: String,
  },
  schedule: {
    enabled: { type: Boolean, default: false },
    cron: String,
  },

  // ── Findings ──
  findings: [{
    severity: { type: String, enum: ['critical', 'high', 'medium', 'low', 'info'] },
    title: String,
    description: String,
    location: String,
    evidence: String,
    remediation: String,
    cwe: String,
    owasp: String,
    category: String,
    cvss: Number,
    status: { type: String, enum: ['open', 'confirmed', 'fixed', 'false-positive'], default: 'open' },
    foundAt: { type: Date, default: Date.now },
  }],

  // ── Recon Data (from Docker scanner) ──
  reconData: {
    subdomains: [{ domain: String, source: String }],
    liveHosts: [mongoose.Schema.Types.Mixed],
    ports: [{
      host: String,
      port: Number,
      protocol: String,
      service: String,
      version: String,
      state: String,
    }],
    directories: [{ url: String, status: Number, size: Number }],
    endpoints: [{ url: String, method: String, source: String }],
    jsFiles: [String],
    sqliResults: [mongoose.Schema.Types.Mixed],
    nucleiResults: [mongoose.Schema.Types.Mixed],
    headers: mongoose.Schema.Types.Mixed,
    summary: {
      subdomainCount: Number,
      liveHostCount: Number,
      openPortCount: Number,
      directoryCount: Number,
      endpointCount: Number,
      jsFileCount: Number,
      nucleiVulnCount: Number,
    },
  },

  // ── Scan Logs (real-time progress) ──
  logs: [{
    timestamp: { type: Date, default: Date.now },
    phase: String,
    message: String,
    level: { type: String, enum: ['info', 'warn', 'error'], default: 'info' },
  }],

  // ── Tools used ──
  toolsUsed: [{
    name: String,
    version: String,
    duration: Number,
  }],

  // ── Progress & timing ──
  progress: { type: Number, default: 0, min: 0, max: 100 },
  startedAt: Date,
  completedAt: Date,
  duration: Number, // seconds

  // ── Report ──
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
}, { timestamps: true });

scanSchema.index({ userId: 1, status: 1 });
scanSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Scan', scanSchema);
