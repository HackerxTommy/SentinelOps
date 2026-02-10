const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const reportController = require('../controllers/reportController');

router.get('/', auth, reportController.listReports);
router.get('/:id', auth, reportController.getReport);
router.get('/:id/download', auth, reportController.downloadReport);
router.post('/generate', auth, requireRole('owner', 'admin', 'analyst'), reportController.generateReport);

module.exports = router;
