const jwt = require('jsonwebtoken');
require('dotenv').config();
const data = require('../models/userModel'); // pastikan sudah refactor userModel ke PostgreSQL

// Login user
const login = async (req, res) => {
  const { nrp, password, androidId, loginAs } = req.body;
  console.log('[Auth] login attempt:', req.body);

  try {
    // Query user dari model
    const user = await data.getRoleByNRPandID(nrp, password, androidId);

    // Jika user tidak ditemukan
    if (!user) {
      return res.status(401).json({ message: 'NRP atau password salah' });
    }

    // Tentukan role
    const role = user.Role ? user.Role : 'user';

    // Buat payload untuk JWT
    const payload = {
      username: user.Nama || user.name || nrp, // fallback ke nrp
      role: role,
      devID: user.device_id || androidId
    };

    // Generate token (6 jam)
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' });

    res.json({ token, role });
  } catch (error) {
    console.error('[Auth] Database error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { login };
