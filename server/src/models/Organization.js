const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  plan: {
    type: String,
    enum: ['free', 'starter', 'pro', 'enterprise'],
    default: 'free',
  },
  razorpay_customer_id: {
    type: String,
    default: null,
  },
  razorpay_subscription_id: {
    type: String,
    default: null,
  },
  settings: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Organization', organizationSchema);
