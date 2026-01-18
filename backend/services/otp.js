const speakeasy = require('speakeasy');

const generateSecret = () => {
  const secret = speakeasy.generateSecret({ length: 20 });
  return secret.base32; 
};

const generateOTP = (secret) => {
  return speakeasy.totp({
    secret: secret,
    encoding: 'base32', 
    step: 30
  });
};

const verifyOTP = (token, secret) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32', 
    token: token,
    window: 2 
  });
};

module.exports = { generateSecret, generateOTP, verifyOTP };