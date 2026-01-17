const express = require('express');
const router = express.Router();

// Debug Middleware: Log all API hits
router.use((req, res, next) => {
    console.log(`[API HIT] ${req.method} ${req.originalUrl} | Body:`, req.body);
    next();
});
const { sendOTP, verifyOTPController } = require('../controllers/otp');
const { login, signup } = require('../controllers/auth');
const { authorizeRequest, blockRequest, exportLogs } = require('../controllers/citizen');
const { protect } = require('../middleware/auth');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTPController);
router.post('/login', login);
router.post('/signup', signup);

// Citizen Actions
router.post('/citizen/authorize', protect, authorizeRequest);
router.post('/citizen/block', protect, blockRequest);
router.get('/citizen/export-logs', protect, exportLogs); // GET for download

module.exports = router;