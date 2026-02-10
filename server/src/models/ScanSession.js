const mongoose = require('mongoose');

const scanSessionSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:       { type: String, enum: ['repo-scan', 'pr-review', 'local-scan'], required: true },
  target:     { type: String, required: true },
  status:     { type: String, enum: ['running', 'completed', 'failed'], default: 'running' },
  filesScanned: { type: Number, default: 0 },
  vulnCount:  { type: Number, default: 0 },
  duration:   { type: Number, default: 0 },
  error:      { type: String, default: null },
}, { timestamps: true });

scanSessionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ScanSession', scanSessionSchema);
