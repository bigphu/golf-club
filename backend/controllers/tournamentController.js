const Tournament = require('../models/Tournament');

exports.getTournaments = async (req, res) => {
  try {
    // Frontend Directory.jsx uses ?status=UPCOMING
    // Frontend Tournaments.jsx uses ?filter=mine
    const { filter, status } = req.query; 
    
    const results = await Tournament.getAll(filter, req.user.id, status);
    res.json(results);
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
};

exports.createTournament = async (req, res) => {
  try {
    // Frontend CreateTournament.jsx sends body
    await Tournament.create(req.user.id, req.body);
    res.json({ message: 'Tournament created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDetails = async (req, res) => {
  try {
    const details = await Tournament.getDetails(req.params.id);
    const participants = await Tournament.getParticipants(req.params.id);
    
    if (!details) return res.status(404).json({ error: 'Tournament not found' });

    res.json({ details, participants });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    await Tournament.register(req.body.tournamentId, req.user.id);
    res.json({ message: 'Application submitted successfully' });
  } catch (error) { 
    res.status(400).json({ error: error.message }); 
  }
};

exports.manage = async (req, res) => {
  const { tournamentId, targetUserId, status } = req.body;
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Unauthorized' });

    await Tournament.manageApplication(req.user.id, tournamentId, targetUserId, status);
    res.json({ message: `User application ${status}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add to tournamentController.js
exports.updateTournament = async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const userId = req.user.id;

    // 1. Fetch current details to check ownership
    const current = await Tournament.getDetails(tournamentId);
    if (!current) return res.status(404).json({ error: 'Tournament not found' });

    // 2. Authorization: Only the creator or an Admin can edit
    if (current.creator_id !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized to edit this tournament' });
    }

    // 3. Perform update
    const updated = await Tournament.update(tournamentId, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};