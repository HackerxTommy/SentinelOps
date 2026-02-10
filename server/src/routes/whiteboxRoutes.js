const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const wb = require('../controllers/whiteboxController');

router.post('/repo/scan',       auth, wb.scanRepo);
router.post('/repo/scan-local', auth, wb.scanLocal);
router.post('/pr/review',       auth, wb.reviewPR);
router.get('/vulnerabilities',  auth, wb.listVulnerabilities);
router.get('/dashboard/stats',  auth, wb.dashboardStats);
router.get('/report',           auth, wb.downloadReport);
router.get('/audit-report',     auth, wb.auditReport);
router.patch('/vulnerabilities/:id/status', auth, wb.updateStatus);

module.exports = router;
