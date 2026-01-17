const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendOTPEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"AU404" <${process.env.SMTP_EMAIL}>`,
    to: toEmail,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It is valid for 30 seconds.`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };
