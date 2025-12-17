const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth'); 
const authController = require('../controllers/authController');
const appController = require('../controllers/appController');

// --- Auth Routes ---
router.post('/register', authController.register);
router.post('/login', authController.login);

// --- User & Profile ---
router.get('/profile', verifyToken, appController.getProfile); 
router.put('/profile', verifyToken, appController.updateProfile);
router.get('/users', verifyToken, appController.getAllUsers); // For Directory

// --- Tournaments ---
router.get('/tournaments', verifyToken, appController.getTournaments); 
router.post('/tournaments/register', verifyToken, appController.registerTournament);
router.post('/tournaments/create', verifyToken, appController.createContent); // Reusing createContent generic or separate if needed

// --- Content (Docs/Notifs) ---
router.get('/documents', verifyToken, appController.getDocuments);
router.get('/notifications', verifyToken, appController.getNotifications);
router.post('/content/create', verifyToken, appController.createContent);

module.exports = router;