"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const rateLimit_1 = require("../middleware/rateLimit");
const router = express_1.default.Router();
router.post('/register', authController_1.register); // Public (for seeding/demo)
router.post('/login', rateLimit_1.authLimiter, authController_1.login);
router.post('/verify-otp', rateLimit_1.authLimiter, authController_1.verifyOtp);
router.post('/logout', authController_1.logout);
router.get('/me', authMiddleware_1.protect, authController_1.getMe);
exports.default = router;
