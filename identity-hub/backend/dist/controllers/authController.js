"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.verifyOtp = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const speakeasy_1 = __importDefault(require("speakeasy"));
const qrcode_1 = __importDefault(require("qrcode"));
const User_1 = require("../models/User");
const env_1 = require("../config/env");
const AuditLog_1 = require("../models/AuditLog");
// Helper to sign JWT
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, env_1.config.jwtSecret, {
        expiresIn: '1d', // Token validity
    });
};
// @desc    Register a new user (Dev/Admin only for seeding typically, but exposing for demo)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    const { email, password, role, name, domain } = req.body;
    try {
        const userExists = await User_1.User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Generate MFA secret immediately
        const secret = speakeasy_1.default.generateSecret({ name: `IdentityHub (${email})` });
        const user = await User_1.User.create({
            email,
            passwordHash: password, // Will be hashed by pre-save
            role,
            name,
            domain,
            mfaSecret: secret.base32,
            mfaEnabled: true, // Enforce MFA
        });
        // Generate QR Code
        const qrCodeUrl = await qrcode_1.default.toDataURL(secret.otpauth_url);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            mfaSecret: secret.base32,
            qrCodeUrl, // Frontend should show this ONCE
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
exports.register = register;
// @desc    Auth user & get token (Step 1: Validate Creds)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.User.findOne({ email }).select('+passwordHash +mfaSecret');
        // Anti-timing attack check (always take same time ideally, but simple check here)
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Prepare temp login token (short lived) for MFA step
        // In a real stateless system, we might sign a temp JWT, or just return success and expect client to send OTP with email.
        // We will return a temp token payload to valid identity for step 2.
        const tempToken = jsonwebtoken_1.default.sign({ id: user._id, preAuth: true }, env_1.config.jwtSecret, { expiresIn: '10m' });
        await AuditLog_1.AuditLog.create({
            actorId: user._id,
            actorEmail: user.email,
            action: 'LOGIN_ATTEMPT_SUCCESS',
            ipAddress: req.ip,
            timestamp: new Date()
        });
        res.json({
            message: 'Credentials valid, MFA required',
            tempToken,
            mfaRequired: true
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.login = login;
// @desc    Verify OTP and Issue Cookie
// @route   POST /api/auth/verify-otp
// @access  Public (with temp token)
const verifyOtp = async (req, res) => {
    const { tempToken, token } = req.body; // 'token' is the OTP code
    try {
        const decoded = jsonwebtoken_1.default.verify(tempToken, env_1.config.jwtSecret);
        if (!decoded.preAuth) {
            return res.status(401).json({ message: 'Invalid flow' });
        }
        const user = await User_1.User.findById(decoded.id).select('+mfaSecret');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        const verified = speakeasy_1.default.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token,
            window: env_1.config.otpWindow
        });
        if (!verified) {
            await AuditLog_1.AuditLog.create({
                actorId: user._id,
                actorEmail: user.email,
                action: 'MFA_FAILURE',
                ipAddress: req.ip
            });
            return res.status(401).json({ message: 'Invalid OTP code' });
        }
        // Success - Set HTTP Only Cookie
        const authToken = generateToken(user._id, user.role);
        res.cookie('token', authToken, {
            httpOnly: true,
            secure: env_1.config.env === 'production', // true in prod
            sameSite: 'strict', // CSRF protection
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        await AuditLog_1.AuditLog.create({
            actorId: user._id,
            actorEmail: user.email,
            action: 'LOGIN_COMPLETE',
            ipAddress: req.ip
        });
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid or expired session' });
    }
};
exports.verifyOtp = verifyOtp;
// @desc    Logout
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
    // Clear cookie
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    if (req.user) {
        await AuditLog_1.AuditLog.create({
            actorId: req.user._id,
            actorEmail: req.user.email,
            action: 'LOGOUT',
            ipAddress: req.ip
        });
    }
    res.json({ message: 'Logged out successfully' });
};
exports.logout = logout;
// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    const user = req.user;
    res.json(user);
};
exports.getMe = getMe;
