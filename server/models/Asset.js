const mongoose = require('mongoose');

const portSchema = new mongoose.Schema({
  port: { type: Number, required: true },
  service: { type: String, default: 'unknown' }
}, { _id: false });

const assetSchema = new mongoose.Schema({
  assetType: {
    type: String,
    enum: ['domain', 'subdomain', 'ip'],
    required: true
  },
  hostname: {
    type: String,
    required: true
  },
  ip: {
    type: String
  },
  ports: [portSchema],
  riskScore: {
    type: Number,
    default: 0
  },
  riskLevel: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    default: 'Low'
  },
  discoveredAt: {
    type: Date,
    default: Date.now
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Asset', assetSchema);
