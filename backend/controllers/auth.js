const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logger = require('../services/logger');
const { JWT_SECRET } = process.env;

const signToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '1h' });
};

const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log('[SIGNUP ATTEMPT]', { email, name, role: req.body.role });

    if (!email || !password || !name) {
      console.log('[SIGNUP FAIL] Missing fields');
      return res.status(400).json({ message: 'Please provide all fields.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('[SIGNUP FAIL] User exists');
      return res.status(400).json({ message: 'User already exists.' });
    }

    const user = new User({
      email,
      password,
      name,
      role: req.body.role || 'CITIZEN'
    });

    await user.save();
    console.log('[SIGNUP SUCCESS] User created:', user._id);

    const token = signToken(user._id, user.role);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(201).json({
      message: 'Signup successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (err) {
    console.error("Signup Error Detailed:", err);
    // Return actual error message for debugging
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Import OTP services
const OtpStore = require('../models/otp.store');
const { generateSecret, generateOTP } = require('../services/otp');
const { sendOTPEmail } = require('../services/mail');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate OTP
    const secret = generateSecret();
    const otp = generateOTP(secret);

    // Store OTP
    await OtpStore.deleteMany({ email });
    await OtpStore.create({
      email,
      secret,
      expiresAt: new Date(Date.now() + 300 * 1000)
    });

    // Send Email
    await sendOTPEmail(email, otp);
    console.log(`[AUTH] OTP for ${email}: ${otp}`);

    // Return MFA Challenge
    res.status(200).json({
      message: 'MFA Verification Required',
      mfaRequired: true,
      tempToken: email
    });

  } catch (err) {
    logger.error("Login Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, signup };