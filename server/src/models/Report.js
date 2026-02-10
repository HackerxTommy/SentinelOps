const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scan' },
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['executive', 'technical', 'remediation', 'audit', 'code-review'],
    default: 'technical',
  },
  status: {
    type: String,
    enum: ['generating', 'ready', 'failed'],
    default: 'generating',
  },
  findingsCount: { type: Number, default: 0 },
  severityCounts: {
    critical: { type: Number, default: 0 },
    high: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    low: { type: Number, default: 0 },
    info: { type: Number, default: 0 },
  },
  // The generated report content (HTML for PDF rendering)
  content: String,
  // Path to the generated PDF file on disk
  pdfPath: String,
  // Target info
  target: String,
  scanType: String,
  methodology: String,
  toolsUsed: [String],
  // Timing
  generatedAt: Date,
}, { timestamps: true });

reportSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
