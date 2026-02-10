const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const Repository = require('../models/Repository');

// List repos — all authenticated users
router.get('/', auth, async (req, res) => {
  try {
    const repos = await Repository.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(repos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add repo — owner/admin only
router.post('/', auth, requireRole('owner', 'admin'), async (req, res) => {
  try {
    const { name, url, provider, branch, language } = req.body;
    const repo = new Repository({
      userId: req.user.id,
      name,
      url,
      provider: provider || 'github',
      branch: branch || 'main',
      language,
    });
    await repo.save();
    res.status(201).json(repo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete repo — owner/admin only
router.delete('/:id', auth, requireRole('owner', 'admin'), async (req, res) => {
  try {
    await Repository.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Repository removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
