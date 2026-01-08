const express = require('express');
const router = express.Router();
const socialController = require('../controllers/social.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/like/:foodId', authMiddleware, socialController.toggleLike);
router.post('/comment/:foodId', authMiddleware, socialController.addComment);
router.get('/comments/:foodId', authMiddleware, socialController.getComments);
router.post('/share/:foodId', authMiddleware, socialController.shareFood);
router.get('/status/:foodId', authMiddleware, socialController.getSocialStatus);

module.exports = router;
