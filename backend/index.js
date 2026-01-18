require('dotenv').config(); // 1. Load env variables immediately
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const connectDB = require('./config/db');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;
const cache = require('./services/cache');

// Security Middleware
app.use(helmet());
app.use(require('compression')()); // Enable Gzip compression

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(require('cookie-parser')());

app.use('/api', apiRoutes);

const startServer = async () => {
  try {
    console.log('[STARTUP] Connecting to database...');
    await connectDB();
    console.log('[STARTUP] Database connected.');

    // Initialize Redis Cache (Non-blocking) - DISABLED FOR DEBUGGING
    // cache.connect().catch(err => console.error("Cache init failed", err));
    console.log('[STARTUP] Redis disabled for debugging.');

    const server = app.listen(PORT, async () => {
      console.log(`Backend running on port ${PORT}`);

      // Seed Users
      const User = require('./models/User');

      // Seed citizen if not exists
      const existingCitizen = await User.findOne({ email: 'citizen@idhub.com' });
      if (!existingCitizen) {
        console.log('[SEED] Seeding citizen@idhub.com...');
        await User.create({
          name: 'John Citizen',
          email: 'citizen@idhub.com',
          password: 'password123',
          role: 'CITIZEN'
        });
      }

      // Seed company user if not exists
      const existingCompany = await User.findOne({ email: 'satvikb0301@gmail.com' });
      if (!existingCompany) {
        console.log('[SEED] Seeding company user satvikb0301@gmail.com...');
        await User.create({
          name: 'Satvik Company',
          email: 'satvikb0301@gmail.com',
          password: 'Satvik@559975',
          role: 'COMPANY'
        });
        console.log('[SEED] Company user seeded successfully');
      } else {
        console.log('[SEED] Company user already exists');
      }

      // Seed admin user if not exists
      const existingAdmin = await User.findOne({ email: 'satvik.p@ahduni.edu.in' });
      if (!existingAdmin) {
        console.log('[SEED] Seeding admin user satvik.p@ahduni.edu.in...');
        await User.create({
          name: 'Satvik Admin',
          email: 'satvik.p@ahduni.edu.in',
          password: 'Satvik@1802',
          role: 'ADMIN'
        });
        console.log('[SEED] Admin user seeded successfully');
      } else {
        console.log('[SEED] Admin user already exists');
      }
    });

    // Graceful Shutdown
    const shutdown = async () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(async () => {
        console.log('HTTP server closed');
        await cache.disconnect();
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
};

startServer();