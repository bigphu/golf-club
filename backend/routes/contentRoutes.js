const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/documents', verifyToken, contentController.getDocuments);
router.get('/notifications', verifyToken, contentController.getNotifications);
router.post('/create', verifyToken, contentController.createContent);
router.put('/:id', verifyToken, contentController.updateContent);

module.exports = router;