const speakeasy = require('speakeasy');

const generateSecret = () => {
  const secret = speakeasy.generateSecret({ length: 20 });
  return secret.base32;
};

const generateOTP = (secret) => {
  const key = speakeasy.totp({
    secret: secret,
    encoding: 'base32',
    step: 30
  });
  console.log(key)
  return key;
};

const verifyOTP = (token, secret) => {
  const key = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2
  });
  console.log(key)
  return key
};

module.exports = { generateSecret, generateOTP, verifyOTP };