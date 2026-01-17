const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTPController } = require('../controllers/otp');
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTPController);
module.exports = router;