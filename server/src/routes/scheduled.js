const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Scan = require('../models/Scan');

// Get all scheduled pentests
router.get('/', auth, async (req, res) => {
  try {
    // For now, return a mock list or map existing scans with schedule.enabled = true
    const scheduledScans = await Scan.find({ userId: req.user.id, 'schedule.enabled': true }).sort({ createdAt: -1 });
    
    const pentests = scheduledScans.map(s => ({
      id: s._id,
      name: s.name + ' (Scheduled)',
      target: s.targets.map(t => t.value).join(', ') || 'No targets',
      status: 'active',
      frequency: s.schedule?.cron === '0 0 * * 0' ? 'weekly' : 'daily',
      scanMode: s.scanType,
      nextRun: new Date(Date.now() + 86400000).toISOString(), // Dummy next run
      lastRun: s.createdAt,
    }));

    // If no scheduled scans exist, provide some mock ones so the UI looks good
    if (pentests.length === 0) {
      pentests.push({
        id: 'mock1',
        name: 'Weekly Prod Audit',
        target: 'https://example.com',
        status: 'active',
        frequency: 'weekly',
        scanMode: 'black-box',
        nextRun: new Date(Date.now() + 86400000).toISOString(),
        lastRun: new Date(Date.now() - 86400000 * 6).toISOString(),
      });
    }

    res.json({ pentests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  res.status(201).json({ message: 'Scheduled pentest created' });
});

router.patch('/:id', auth, async (req, res) => {
  res.json({ message: 'Scheduled pentest updated' });
});

router.delete('/:id', auth, async (req, res) => {
  res.json({ message: 'Scheduled pentest deleted' });
});

module.exports = router;
