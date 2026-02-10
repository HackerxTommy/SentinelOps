const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const codeReview = require('../controllers/codeReviewController');

// GitHub integration
router.get('/github/repos', auth, codeReview.listGithubRepos);
router.get('/github/:owner/:repo/prs', auth, codeReview.listPRs);
router.post('/github/:owner/:repo/prs/:prNumber/review', auth, requireRole('owner', 'admin', 'analyst'), codeReview.reviewPR);

// Source code scanning
router.post('/github/:owner/:repo/scan', auth, requireRole('owner', 'admin', 'analyst'), codeReview.scanRepo);

module.exports = router;
