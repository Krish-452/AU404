import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { User, IUser } from '../models/User';
import { config } from '../config/env';
import { AuditLog } from '../models/AuditLog';

// Helper to sign JWT
const generateToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, config.jwtSecret, {
        expiresIn: '1d', // Token validity
    });
};

// @desc    Register a new user (Dev/Admin only for seeding typically, but exposing for demo)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
    const { email, password, role, name, domain } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate MFA secret immediately (for backend compatibility)
        const secret = speakeasy.generateSecret({ name: `IdentityHub (${email})` });

        const user = await User.create({
            email,
            passwordHash: password,
            role, // Should be Uppercase from frontend
            name,
            domain,
            mfaSecret: secret.base32,
            mfaEnabled: true,
        });

        // No QRCode needed for Email OTP flow

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        console.error('[REGISTER ERROR]', error);
        res.status(500).json({ message: 'Server Error', error });
    }
};

// @desc    Auth user & get token (Step 1: Validate Creds)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        console.log(`[LOGIN ATTEMPT] Email: ${email}`);
        const user = await User.findOne({ email }).select('+passwordHash +mfaSecret');

        if (!user) {
            console.log('[LOGIN FAIL] User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('[LOGIN FAIL] Password mismatch');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Prepare temp login token (short lived) for MFA step
        // In a real stateless system, we might sign a temp JWT, or just return success and expect client to send OTP with email.
        // We will return a temp token payload to valid identity for step 2.
        // Generate 6-digit Email OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Save to user with 10 minute expiration
        user.otpCode = otpCode;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        // SIMULATE SENDING EMAIL (In production, use nodemailer/SendGrid)
        console.log('================================================');
        console.log(`[EMAIL SERVICE] Sending OTP to ${user.email}: ${otpCode}`);
        console.log('================================================');

        // Prepare temp login token
        const tempToken = jwt.sign({ id: user._id, preAuth: true }, config.jwtSecret, { expiresIn: '10m' });

        await AuditLog.create({
            actorId: user._id,
            actorEmail: user.email,
            action: 'LOGIN_ATTEMPT_SUCCESS',
            ipAddress: req.ip,
            timestamp: new Date()
        });

        res.status(200).json({
            message: 'MFA Verification Required',
            mfaRequired: true,
            tempToken,
            // SECURITY: Only for Demo/Dev mode to unblock user
            debugOtp: process.env.NODE_ENV === 'development' ? otpCode : undefined
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify OTP and Issue Cookie
// @route   POST /api/auth/verify-otp
// @access  Public (with temp token)
export const verifyOtp = async (req: Request, res: Response) => {
    const { tempToken, token } = req.body; // 'token' is the OTP code

    try {
        const decoded = jwt.verify(tempToken, config.jwtSecret) as any;
        if (!decoded.preAuth) {
            return res.status(401).json({ message: 'Invalid flow' });
        }

        const user = await User.findById(decoded.id).select('+mfaSecret +otpCode +otpExpires');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Verify Email OTP
        if (!user.otpCode || !user.otpExpires || user.otpCode !== token) {
            return res.status(401).json({ message: 'Invalid OTP code' });
        }

        if (user.otpExpires < new Date()) {
            return res.status(401).json({ message: 'OTP expired' });
        }

        // Clear OTP after successful use
        user.otpCode = undefined;
        user.otpExpires = undefined;
        await user.save();

        const verified = true; // Logic replaced above

        if (!verified) {
            await AuditLog.create({
                actorId: user._id,
                actorEmail: user.email,
                action: 'MFA_FAILURE',
                ipAddress: req.ip
            });
            return res.status(401).json({ message: 'Invalid OTP code' });
        }

        // Success - Set HTTP Only Cookie
        const authToken = generateToken(user._id.toString(), user.role);

        res.cookie('token', authToken, {
            httpOnly: true,
            secure: config.env === 'production', // true in prod
            sameSite: 'strict', // CSRF protection
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        await AuditLog.create({
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

    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired session' });
    }
};

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response) => {
    // Clear cookie
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    if (req.user) {
        await AuditLog.create({
            actorId: req.user._id as any,
            actorEmail: req.user.email,
            action: 'LOGOUT',
            ipAddress: req.ip
        });
    }

    res.json({ message: 'Logged out successfully' });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
    const user = req.user;
    res.json(user);
};
