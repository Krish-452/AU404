const OtpStore = require('../models/otp.store');
const { generateSecret, generateOTP, verifyOTP } = require('../services/otp');
const { sendOTPEmail } = require('../services/mail');

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`[OTP Controller] Request received for: ${email}`);

    if (!email) {
      console.log(`[OTP Controller] FAIL: No email provided`);
      return res.status(400).json({ message: 'Email required.' });
    }

    console.log(`[OTP Controller] Deleting old OTPs...`);
    await OtpStore.deleteMany({ email });

    console.log(`[OTP Controller] Generating new OTP...`);
    const secret = generateSecret();
    const otp = generateOTP(secret);
    console.log(`[OTP Controller] OTP Generated: ${otp} (Secret: ${secret})`);

    console.log(`[OTP Controller] Storing in DB...`);
    await OtpStore.create({
      email,
      secret,
      expiresAt: new Date(Date.now() + 300 * 1000)
    });

    console.log(`[OTP Controller] Sending Email...`);
    await sendOTPEmail(email, otp);

    console.log(`[OTP Controller] SUCCESS: OTP Sequence Complete`);
    res.json({ message: 'OTP sent' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// Import User and JWT for final authentication
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const signToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '1h' });
};

const verifyOTPController = async (req, res) => {
  try {
    const { email, token } = req.body; // Frontend sends 'tempToken' as 'email' from AuthContext potentially?
    // Wait, AuthContext sends: { tempToken, token: code }. tempToken IS the email in my implementation.
    // So req.body.tempToken (if used) or we need to ensure Frontend sends 'email': tempToken.
    // Let's check AuthContext. verifiedMfa(code) calls api.post('/auth/verify-otp', { tempToken, token: code });
    // So the body is { tempToken: "email@...", token: "123456" }.

    // Changing destructuring to match Frontend payload
    const userEmail = req.body.email || req.body.tempToken;
    const otpCode = req.body.token;

    const record = await OtpStore.findOne({ email: userEmail });

    if (!record) {
      return res.status(400).json({ message: 'OTP expired or not requested' });
    }

    const isValid = verifyOTP(String(otpCode), record.secret);

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    await OtpStore.deleteOne({ _id: record._id });

    // OTP Valid! Now Log the User In.
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const jwtToken = signToken(user._id, user.role);

    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.json({
      message: 'OTP verified successfully',
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: jwtToken
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'OTP verification failed' });
  }
};

module.exports = {
  sendOTP,
  verifyOTPController
};