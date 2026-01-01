const db = require('../config/db');

class Tournament {
  static async getAll(filter, userId, status) {
    let query = 'CALL get_tournaments_view(?)';
    let params = [null];

    if (filter === 'mine') {
      // Logic for "My Tournaments" page
      query = 'CALL get_my_tournaments(?)';
      params = [userId];
    } 
    
    // Note: If you need to filter by status (UPCOMING) used in Directory,
    // you can handle it here or let the frontend filter the returned list.
    // For now, we return the list and let the controller/frontend filter if needed,
    // or you can add a `get_tournaments_by_status` procedure.
    
    const [results] = await db.query(query, params);
    let rows = results[0];

    // Optional JS filtering if procedure doesn't support status param
    if (status && filter !== 'mine') {
        rows = rows.filter(t => t.status === status);
    }

    return rows;
  }

  static async create(userId, { name, description, startDate, endDate, location, maxParticipants, entryFee, format, imageUrl }) {
    return db.query('CALL create_tournament(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
      userId, name, description, startDate, endDate, 
      location, maxParticipants, entryFee, format, imageUrl
    ]);
  }

  static async getDetails(id) {
    const [details] = await db.query('CALL get_tournament_details(?)', [id]);
    return details[0][0];
  }

  static async getParticipants(id) {
    const [participants] = await db.query('CALL get_tournament_participants(?)', [id]);
    return participants[0];
  }

  static async register(tournamentId, userId) {
    return db.query('CALL apply_for_tournament(?, ?)', [tournamentId, userId]);
  }

  static async manageApplication(adminId, tournamentId, targetUserId, status) {
    return db.query('CALL manage_tournament_application(?, ?, ?, ?)', [
      adminId, tournamentId, targetUserId, status
    ]);
  }

  // Add to Tournament.js
static async update(tournamentId, { name, description, startDate, endDate, location, maxParticipants, entryFee, format, imageUrl }) {
  const [results] = await db.query(
    'CALL update_tournament(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      tournamentId, 
      name, 
      description, 
      location, 
      startDate, 
      endDate, 
      format, 
      maxParticipants, 
      entryFee, 
      imageUrl
    ]
  );
  // The procedure returns the updated tournament details
  return results[0][0];
}
}

module.exports = Tournament;