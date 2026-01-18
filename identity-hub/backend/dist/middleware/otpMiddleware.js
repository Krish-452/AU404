"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireHighRiskOtp = void 0;
const speakeasy_1 = __importDefault(require("speakeasy"));
const env_1 = require("../config/env");
const User_1 = require("../models/User");
const requireHighRiskOtp = async (req, res, next) => {
    const otpCode = req.headers['x-otp-code']; // Client must send this header
    if (!otpCode) {
        return res.status(403).json({
            message: 'MFA_REQUIRED',
            requiresOtp: true,
            action: 'This action requires OTP re-verification'
        });
    }
    // Ensure user is loaded (protect middleware should run before this)
    if (!req.user) {
        return res.status(401).json({ message: 'User context missing' });
    }
    // We need the secret, which is usually not selected by default in 'protect' for security.
    // We must fetch it explicitly.
    const user = await User_1.User.findById(req.user._id).select('+mfaSecret');
    if (!user || !user.mfaSecret) {
        return res.status(400).json({ message: 'MFA not set up for user' });
    }
    const verified = speakeasy_1.default.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: otpCode,
        window: env_1.config.otpWindow
    });
    if (!verified) {
        return res.status(403).json({ message: 'Invalid OTP code' });
    }
    next();
};
exports.requireHighRiskOtp = requireHighRiskOtp;
