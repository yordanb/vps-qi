const jwt = require('jsonwebtoken');
require('dotenv').config();
const data = require('../models/userModel');

// Cek Android ID sudah terdaftar
const getAndroidId = async (req, res) => {
  const { androidID } = req.body;
  console.log('[AndroidID] request:', req.body);

  try {
    const user = await data.getRoleByAndroidID(androidID);

    // Jika user tidak ditemukan
    if (!user) {
      return res.status(401).json({ message: 'Device belum terdaftar', registered: false });
    }

    // Buat payload untuk token
    const payload = {
      id: user.id,
      username: user.Nama,
      nrp: user.NRP,
      devID: user.android_id,
      registered: true
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' });

    // Catat login activity
    await data.logLoginActivity(user.android_id, user.Nama, user.NRP);

    res.json({
      status: 'already_registered',
      token,
      nrp: user.NRP,
      role: user.Role
    });
  } catch (error) {
    console.error('[AndroidID] Database error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Registrasi device berdasarkan Android ID
const regDevice = async (req, res) => {
  const { nrp, name, password, def_password, androidID } = req.body;
  console.log('[AndroidID] register:', req.body);

  try {
    const user = await data.regDevByAndroidID(nrp, name, password, def_password, androidID);

    // Jika gagal registrasi
    if (!user) {
      return res.status(401).json({ message: 'Registrasi gagal, data tidak cocok', registered: false });
    }

    // Buat payload untuk token
    const payload = {
      id: user.NRP,
      username: user.Nama,
      devID: user.android_id,
      registered: true
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' });

    res.json({
      status: 'success',
      payload,
      token
    });
  } catch (error) {
    console.error('[AndroidID] Database error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAndroidId, regDevice };
