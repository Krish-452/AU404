import { Request, Response, NextFunction } from 'express';
import speakeasy from 'speakeasy';
import { config } from '../config/env';
import { User } from '../models/User';

export const requireHighRiskOtp = async (req: Request, res: Response, next: NextFunction) => {
    const otpCode = req.headers['x-otp-code'] as string; // Client must send this header

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
    const user = await User.findById(req.user._id).select('+mfaSecret');

    if (!user || !user.mfaSecret) {
        return res.status(400).json({ message: 'MFA not set up for user' });
    }

    const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: otpCode,
        window: config.otpWindow
    });

    if (!verified) {
        return res.status(403).json({ message: 'Invalid OTP code' });
    }

    next();
};
