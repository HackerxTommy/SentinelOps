const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const Domain = require('../models/Domain');

// List domains — all authenticated users
router.get('/', auth, async (req, res) => {
  try {
    const domains = await Domain.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(domains);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add domain — owner/admin only
router.post('/', auth, requireRole('owner', 'admin'), async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ message: 'Domain is required' });
    
    const existing = await Domain.findOne({ userId: req.user.id, domain });
    if (existing) return res.status(400).json({ message: 'Domain already added' });

    const newDomain = new Domain({
      userId: req.user.id,
      domain,
      status: 'active',
    });
    await newDomain.save();
    res.status(201).json(newDomain);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete domain — owner/admin only
router.delete('/:id', auth, requireRole('owner', 'admin'), async (req, res) => {
  try {
    await Domain.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Domain removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
