const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');

        await User.deleteMany({}); // CLEAR DB

        const users = [
            {
                name: 'Test Citizen',
                email: 'citizen@test.com',
                password: 'password123',
                role: 'CITIZEN'
            },
            {
                name: 'Test Company',
                email: 'company@test.com',
                password: 'password123',
                role: 'COMPANY'
            },
            {
                name: 'Test Admin',
                email: 'admin@test.com',
                password: 'password123',
                role: 'ADMIN'
            }
        ];

        for (const u of users) {
            const user = new User(u);
            await user.save();
            console.log(`Created user: ${u.email}`);
        }

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
