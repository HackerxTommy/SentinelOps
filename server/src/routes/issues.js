const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const issueController = require('../controllers/issueController');

router.get('/', auth, issueController.listIssues);
router.get('/stats/summary', auth, issueController.getStats);
router.get('/:id', auth, issueController.getIssue);
router.patch('/:id', auth, requireRole('owner', 'admin', 'analyst'), issueController.updateIssue);
router.post('/:id/comments', auth, issueController.addComment);
router.post('/:id/autofix', auth, requireRole('owner', 'admin'), issueController.requestAutoFix);
router.patch('/bulk/status', auth, requireRole('owner', 'admin'), issueController.bulkUpdateStatus);

module.exports = router;
