const jwt = require('jsonwebtoken');
require('dotenv').config();
const data = require('../models/userModel');

// Dummy user untuk contoh
/*
const users = [
    {
        id: 1,
        username: 'user1',
        password: 'password1',
        role: 'staff'
    },
    {
        id: 2,
        username: 'user2',
        password: 'password2',
        role: 'mekanik'
    }
];

const login = (req, res) => {
    const { username, password } = req.body;

    // Cari user berdasarkan username dan password
    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (!user) {
        return res.status(401).json({ message: 'Username atau password salah' });
    }

    // Buat payload untuk token
    const payload = {
        id: user.id,
        username: user.username,
        role: user.role
    };

    // Generate token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1m' });

    res.json({ token });
};

module.exports = { login };
*/


//versi data dari mysql2

const getAndroidId = async (req, res) => {
    const { androidID } = req.body;
    console.log(req.body);

    try {
        // Query untuk mencari user berdasarkan username dan password
        /*
        const [rows] = await db.query(
            'SELECT id, username, role FROM tb_users WHERE username = ? AND password = ?',
            [username, password]
        );
        */

        const rows = await data.getRoleByAndroidID(androidID); 
        // Jika user tidak ditemukan
        if (!rows || rows.length === 0){
            return res.status(401).json({ message: 'Username atau password salah', registered: false });
        }

        const user = rows[0];

        // Buat payload untuk token
        const payload = {
            id: user.id,
            username: user.Nama,
            nrp: user.NRP,
            devID: user.android_id,
            //role: user.Role,
            registered: true
        }; //console.log(payload);
        const nrp = user.NRP;
        const role = user.Role;
        const nama = user.Nama;

        const status = 'already_registered';

        // Generate token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' });
        //const query = `data.logLoginActivity(${androidID},${nama}, ${nrp}`;
        // Log aktivitas login menggunakan fungsi logLoginActivity
        const logCatatan = await data.logLoginActivity(`${androidID}`,`${nama}`,`${nrp}`);
        //console.log(logCatatan);

        res.json({ status, token, nrp, role});
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const regDevice = async (req, res) => {
    const { nrp, name, password, def_password, androidID } = req.body;
    //console.log(req.body);

    try {
        const rows = await data.regDevByAndroidID(nrp, name, password, def_password, androidID); 
        // Jika user tidak ditemukan
        if (!rows || rows.length === 0) {
            return res.status(401).json({ message: 'Username atau password salah', registered: false});
        } //console.log(rows);

        const user = rows[0];

        // Buat payload untuk token
        const payload = {
            id: nrp,
            username: name,
            //role: user.Role,
            devID: androidID,
            registered: true
        }; //console.log(payload);

        const status = 'success';

        // Generate token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' });

        res.json({ status, payload, token });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getAndroidId, regDevice };
