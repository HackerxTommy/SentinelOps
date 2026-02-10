const mongoose = require('mongoose');

const repositorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
  provider: { type: String, enum: ['github', 'gitlab', 'bitbucket', 'manual'], default: 'github' },
  branch: { type: String, default: 'main' },
  language: String,
  lastScanned: Date,
  status: { type: String, enum: ['connected', 'disconnected', 'scanning', 'error'], default: 'connected' },
  issueCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Repository', repositorySchema);
