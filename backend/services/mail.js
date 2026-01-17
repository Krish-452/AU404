const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  }
});

const sendOTPEmail = async (toEmail, otp) => {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.warn("SMTP Params missing. Mocking email send.");
    console.log(`[MOCK EMAIL] To: ${toEmail}, OTP: ${otp}`);
    return;
  }

  const mailOptions = {
    from: `"AU404" <${process.env.SMTP_EMAIL}>`,
    to: toEmail,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It is valid for 30 seconds.`,
  };
  console.log(mailOptions)
  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SENT] To: ${toEmail}, OTP: ${otp}`);
  } catch (error) {
    console.error("Failed to send email:", error);
    // Fallback log for dev
    console.log(`[FALLBACK OTP] To: ${toEmail}, OTP: ${otp}`);
  }
};

module.exports = { sendOTPEmail };
