"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const speakeasy_1 = __importDefault(require("speakeasy"));
const User_1 = require("../models/User");
const env_1 = require("../config/env");
dotenv_1.default.config();
const seed = async () => {
    try {
        await mongoose_1.default.connect(env_1.config.mongoUri);
        console.log('Connected to DB');
        await User_1.User.deleteMany({});
        console.log('Cleared Users');
        // Common secret for testing convenience: 'KRUGS4ZANFZSA3LZEBQXK4LM' (random base32)
        // In real app, each user has unique secret.
        const testSecret = speakeasy_1.default.generateSecret();
        const secret = testSecret.base32;
        const users = [
            {
                email: 'citizen@idhub.com',
                password: 'password123',
                role: 'citizen',
                name: 'John Citizen',
                mfaSecret: secret,
                mfaEnabled: true
            },
            {
                email: 'company@idhub.com',
                password: 'password123',
                role: 'company',
                name: 'Acme Corp',
                domain: 'acme.com',
                mfaSecret: secret,
                mfaEnabled: true
            },
            {
                email: 'admin@idhub.com',
                password: 'password123',
                role: 'admin',
                name: 'System Admin',
                mfaSecret: secret,
                mfaEnabled: true
            }
        ];
        for (const u of users) {
            // Create manually to ensure pre-save hooks run if needed, or use create
            await User_1.User.create({
                email: u.email,
                passwordHash: u.password, // Hook will hash
                role: u.role,
                name: u.name,
                domain: u.domain,
                mfaSecret: u.mfaSecret,
                mfaEnabled: u.mfaEnabled
            });
        }
        console.log('------------------------------------------------');
        console.log('SEEDING COMPLETE');
        console.log(`COMMON MFA SECRET (Base32): ${secret}`);
        console.log('Use this code in Authenticator App (Google/Authy) or for manual testing.');
        console.log('------------------------------------------------');
        process.exit(0);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
seed();
