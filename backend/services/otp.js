const { authenticator } = require('otplib');

authenticator.options = {
  step: 30,        
  digits: 6
};

const generateOTP = (secret) => {
  return authenticator.generate(secret);
};
const generateSecret = () => {
  return authenticator.generateSecret();
};
const verifyOTP = (token, secret) => {
  return authenticator.verify({ token, secret });
};

module.exports = { generateOTP, verifyOTP, generateSecret };