const OtpStore = require('../models/otp.store');
const { generateSecret, generateOTP, verifyOTP } = require('../services/otp');
const { sendOTPEmail } = require('../services/mail');

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email required.' });
    }

    await OtpStore.deleteMany({ email });

    const secret = generateSecret();
    const otp = generateOTP(secret);

    await OtpStore.create({
      email,
      secret,
      expiresAt: new Date(Date.now() + 30 * 1000)
    });

    await sendOTPEmail(email, otp);
    res.json({ message: 'OTP sent' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

const verifyOTPController = async (req, res) => {
  try {
    const { email, token } = req.body;

    const record = await OtpStore.findOne({ email });

    if (!record) {
      return res.status(400).json({ message: 'OTP expired or not requested' });
    }

    const isValid = verifyOTP(token, record.secret);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    await OtpStore.deleteOne({ _id: record._id });

    res.json({ message: 'OTP verified successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'OTP verification failed' });
  }
};

module.exports = {
  sendOTP,
  verifyOTPController
};
