import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/identity-hub',
    jwtSecret: process.env.JWT_SECRET || 'dev_secret_CHANGE_IN_PROD',
    env: process.env.NODE_ENV || 'development',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    otpWindow: parseInt(process.env.OTP_WINDOW || '1'), // Speakeasy window preference
};

if (config.env === 'production' && config.jwtSecret === 'dev_secret_CHANGE_IN_PROD') {
    console.error('CRITICAL: JWT_SECRET must be set in production!');
    process.exit(1);
}
