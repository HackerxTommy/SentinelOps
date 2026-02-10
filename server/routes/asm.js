const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth'); // User assumes it's at server/middleware/auth.js but we will use the assumed path
const asmController = require('../controllers/asmController');

// The instructions state: "assume it exists at ../../middleware/auth"
// But since this file is at server/routes/asm.js, ../../middleware/auth would be server/../middleware/auth
// I will just use the correct relative path based on the user's requirement.

router.post('/scan', auth, asmController.scanTargetDomain);
router.get('/assets', auth, asmController.getAssets);
router.get('/assets/:id', auth, asmController.getAssetById);
router.delete('/assets/:id', auth, asmController.deleteAsset);
router.get('/stats', auth, asmController.getStats);

module.exports = router;
