const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  org_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password_hash: {
    type: String,
    required: function() { return !this.sso_provider; },
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  role: {
    type: String,
    enum: ['owner', 'admin', 'analyst', 'viewer'],
    default: 'owner',
  },
  sso_provider: {
    type: String,
    default: null,
  },
  last_login: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Don't return password_hash in JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password_hash;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
