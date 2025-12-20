const db = require('../config/db');

class User {
  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findRoleById(userId) {
    // Check Admin table first
    const [admins] = await db.query('SELECT * FROM admins WHERE admin_id = ?', [userId]);
    if (admins.length > 0) return 'ADMIN';
    
    // Check Member table
    const [members] = await db.query('SELECT * FROM members WHERE member_id = ?', [userId]);
    if (members.length > 0) return 'MEMBER';
    
    return 'GUEST';
  }

  static async create({ email, password, lastName, firstName, phone, vgaNumber, shirtSize, bio, profilePic, bgColor }) {
    // Maps frontend formData keys to Stored Procedure arguments
    return db.query(
      'CALL register_user(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [
        email, 
        password, // In prod, hash this!
        lastName, 
        firstName, 
        phone, 
        vgaNumber || null, 
        shirtSize || null, 
        bio || null, 
        profilePic || null, 
        bgColor || null 
      ]
    );
  }

  static async getProfile(userId) {
    const [results] = await db.query('CALL get_user_full_profile(?)', [userId]);
    return results[0][0]; // Procedure returns [[row]]
  }

  static async updateProfile(id, { firstName, lastName, phoneNumber, vgaNumber, shirtSize, bio, profilePicUrl, backgroundColorHex }) {
    const [results] = await db.query('CALL update_user_profile(?, ?, ?, ?, ?, ?, ?, ?, ?)', [
      id,
      firstName,
      lastName,
      phoneNumber,
      vgaNumber || null,
      shirtSize || null,
      bio || null,
      profilePicUrl || 'default_avatar.png',
      backgroundColorHex || '#64748b'
    ]);
    return results[0][0];
  }

  static async getDirectory() {
    const [results] = await db.query('CALL get_directory_users()');
    return results[0];
  }

  static async getMembershipRequests() {
    const [results] = await db.query('CALL get_pending_membership_requests()');
    return results[0];
  }

  static async manageMembershipRequest(adminId, { requestId, status, comment }) {
    const [results] = await db.query('CALL process_membership_request(?, ?, ?, ?)', [
      adminId,
      requestId,
      status,
      comment || null
    ]);
    return results[0];
  }
}

module.exports = User;