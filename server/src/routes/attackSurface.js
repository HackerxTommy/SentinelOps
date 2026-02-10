const express = require('express');
const router = express.Router();
const attackSurfaceController = require('../controllers/attackSurfaceController');
const auth = require('../middleware/auth');

router.get('/', auth, attackSurfaceController.listAssets);

module.exports = router;
