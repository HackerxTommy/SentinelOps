const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  domain: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive', 'verifying', 'error'], default: 'active' },
  verified: { type: Boolean, default: false },
  subdomains: [String],
  technologies: [String],
  lastScanned: Date,
  issueCount: { type: Number, default: 0 },
  sslExpiry: Date,
  ipAddress: String,
}, { timestamps: true });

module.exports = mongoose.model('Domain', domainSchema);
