const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const auth = require('../middleware/auth');
const Subscription = require('../models/Subscription');

const PLANS = {
  pro: { name: 'Pro', amount: 2999, currency: 'INR', scans: 50 },
  enterprise: { name: 'Enterprise', amount: 9999, currency: 'INR', scans: 999 },
};

function getRazorpayInstance() {
  try {
    const Razorpay = require('razorpay');
    // Ensure we read process.env dynamically
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (keyId && keySecret) {
      return new Razorpay({ key_id: keyId, key_secret: keySecret });
    }
  } catch (e) {
    console.warn('Razorpay not initialized:', e.message);
  }
  return null;
}

// Get current subscription
router.get('/subscription', auth, async (req, res) => {
  try {
    let sub = await Subscription.findOne({ userId: req.user.id });
    if (!sub) {
      sub = await Subscription.create({ userId: req.user.id, plan: 'free', scansRemaining: 5, maxScans: 5 });
    }
    res.json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create order for plan upgrade
router.post('/create-order', auth, async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = PLANS[planId];
    if (!plan) return res.status(400).json({ message: 'Invalid plan' });

    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      return res.status(503).json({ message: 'Payment system not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env' });
    }

    const order = await razorpay.orders.create({
      amount: plan.amount * 100, // paise
      currency: plan.currency,
      receipt: `so_${req.user.id.toString().slice(-8)}_${Date.now()}`,
      notes: { userId: req.user.id.toString(), plan: planId },
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      plan,
    });
  } catch (err) {
    console.error('Billing create-order error:', err);
    res.status(500).json({ message: err.error?.description || err.message || 'Payment initiation failed' });
  }
});

// Verify payment
router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;
    
    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (secret) {
      const generated = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
      
      if (generated !== razorpay_signature) {
        return res.status(400).json({ message: 'Payment verification failed' });
      }
    }

    const plan = PLANS[planId];
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    await Subscription.findOneAndUpdate(
      { userId: req.user.id },
      {
        plan: planId,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        status: 'active',
        currentPeriodEnd: periodEnd,
        scansRemaining: plan.scans,
        maxScans: plan.scans,
      },
      { upsert: true }
    );

    res.json({ message: 'Payment verified, plan upgraded', plan: planId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
