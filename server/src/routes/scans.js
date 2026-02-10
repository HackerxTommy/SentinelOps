const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const scanController = require('../controllers/scanController');

// All authenticated users can list and view scans
router.get('/', auth, scanController.listScans);
router.get('/analytics/dashboard', auth, scanController.getAnalytics);
router.get('/:id', auth, scanController.getScan);
router.get('/:id/findings', auth, scanController.getFindings);
router.get('/:id/logs', auth, scanController.getLogs);
router.get('/:id/recon', auth, scanController.getReconData);

// Creating, cancelling, deleting scans requires owner/admin/analyst
router.post('/', auth, requireRole('owner', 'admin', 'analyst'), scanController.createScan);
router.patch('/:id/cancel', auth, requireRole('owner', 'admin', 'analyst'), scanController.cancelScan);
router.delete('/:id', auth, requireRole('owner', 'admin'), scanController.deleteScan);

module.exports = router;
