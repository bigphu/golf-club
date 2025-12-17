const db = require('../config/db');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt'); // Commented out for demo

exports.register = async (req, res) => {
  // 1. Destructure all fields including new golf specific ones
  const { 
    email, password, lastName, firstName, phone, 
    vgaNumber, shirtSize, bio, profilePic, bgColor 
  } = req.body;

  try {
    // Demo: Use plain text password (no hashing)
    const passwordHash = password; 

    // 2. Call the register_user procedure with ALL 10 parameters
    await db.query(
      'CALL register_user(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [
        email, 
        passwordHash, 
        lastName, 
        firstName, 
        phone, 
        vgaNumber || null,    // Pass VGA Number
        shirtSize || null,    // Pass Shirt Size
        bio || null, 
        profilePic || null,   // Procedure handles default
        bgColor || null       // Procedure handles default
      ]
    );
    
    res.status(201).json({ message: 'Registration successful. Membership is pending approval.' });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body; 

  try {
    // 1. Find User by Email
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const user = users[0];

    // 2. Demo: Verify Plain Text Password
    // const match = await bcrypt.compare(password, user.password_hash);
    const match = password === user.password_hash; 
    
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3. Determine Role
    let role = 'GUEST';
    
    const [admins] = await db.query('SELECT * FROM admins WHERE admin_id = ?', [user.user_id]);
    if (admins.length > 0) role = 'ADMIN';
    else {
      const [members] = await db.query('SELECT * FROM members WHERE member_id = ?', [user.user_id]);
      if (members.length > 0) role = 'MEMBER';
    }

    // 4. Generate Token
    const token = jwt.sign(
      { id: user.user_id, role: role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 5. Return User Data
    res.json({
      token,
      user: {
        id: user.user_id,
        username: user.email.split('@')[0], 
        email: user.email,
        role: role,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_pic: user.profile_pic_url
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};