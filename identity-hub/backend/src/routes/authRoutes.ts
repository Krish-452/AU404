import express from 'express';
import { login, register, verifyOtp, logout, getMe } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { authLimiter } from '../middleware/rateLimit';

const router = express.Router();

router.post('/register', register); // Public (for seeding/demo)
router.post('/login', authLimiter, login);
router.post('/verify-otp', authLimiter, verifyOtp);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
