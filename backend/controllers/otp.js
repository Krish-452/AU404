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

const verifyOTPController = async (req, res) => {
  try {
    const { email, token } = req.body;

    const record = await OtpStore.findOne({ email });

    if (!record) {
      return res.status(400).json({ message: 'OTP expired or not requested' });
    }

    const isValid = verifyOTP(String(token), record.secret);

    //console.log(`Verifying: ${token} against Secret: ${record.secret} -> Valid: ${isValid}`);

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