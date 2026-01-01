const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, tournamentController.getTournaments);
router.post('/create', verifyToken, tournamentController.createTournament);
router.get('/:id', verifyToken, tournamentController.getDetails);
router.put('/:id', verifyToken, tournamentController.updateTournament);

// Actions
router.post('/register', verifyToken, tournamentController.register);
router.post('/manage', verifyToken, tournamentController.manage);

module.exports = router;