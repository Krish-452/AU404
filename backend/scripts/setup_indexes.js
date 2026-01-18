const mongoose = require('mongoose');
require('dotenv').config();

const applyIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('[INDEXER] Connected to DB');

        // User Indexes
        const User = require('../models/User');
        // Compound index for getting users by role (frequent admin op)
        await User.collection.createIndex({ role: 1, email: 1 });
        // Text index for name search
        await User.collection.createIndex({ name: 'text' });

        console.log('[INDEXER] User Indexes applied');

        // OTP Indexes (Ensure TTL)
        const OtpStore = require('../models/otp.store');
        const otpIndexes = await OtpStore.collection.indexes();
        const hasTTL = otpIndexes.some(i => i.expireAfterSeconds !== undefined);

        if (!hasTTL) {
            console.log('[INDEXER] Verifying TTL index on OTP Store...');
            // Mongoose schema handles this, but explicit check is good
            await OtpStore.syncIndexes();
        }
        console.log('[INDEXER] OTP Indexes verified');

        console.log('[INDEXER] Optimization Complete');
        process.exit(0);
    } catch (err) {
        console.error('[INDEXER] Failed', err);
        process.exit(1);
    }
};

applyIndexes();
