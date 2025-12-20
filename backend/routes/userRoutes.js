const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);
router.get('/users', verifyToken, userController.getDirectory);
router.get('/requests', verifyToken, userController.getMembershipRequests);
router.post('/requests/manage', verifyToken, userController.manageMembershipRequest);

module.exports = router;