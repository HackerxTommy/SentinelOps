const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  razorpayCustomerId: String,
  razorpaySubscriptionId: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  status: { type: String, enum: ['active', 'cancelled', 'expired', 'pending'], default: 'active' },
  currentPeriodEnd: Date,
  scansRemaining: { type: Number, default: 30 }, // free tier gets 5
  maxScans: { type: Number, default: 30 },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
