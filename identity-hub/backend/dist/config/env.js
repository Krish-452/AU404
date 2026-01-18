"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/identity-hub',
    jwtSecret: process.env.JWT_SECRET || 'dev_secret_CHANGE_IN_PROD',
    env: process.env.NODE_ENV || 'development',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    otpWindow: parseInt(process.env.OTP_WINDOW || '1'), // Speakeasy window preference
};
if (exports.config.env === 'production' && exports.config.jwtSecret === 'dev_secret_CHANGE_IN_PROD') {
    console.error('CRITICAL: JWT_SECRET must be set in production!');
    process.exit(1);
}
