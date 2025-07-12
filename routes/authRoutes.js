const express = require('express');
const { login } = require('../controllers/authController');
const { getAndroidId , regDevice } = require('../controllers/androidIdController.js');

const router = express.Router();

router.post('/login', login);
router.post('/id-cek', getAndroidId);
router.post('/reg', regDevice);

module.exports = router;
