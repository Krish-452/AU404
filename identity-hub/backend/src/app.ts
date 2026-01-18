import express from 'express';
import './types'; // Load type augmentations
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { config } from './config/env';
import authRoutes from './routes/authRoutes';
import { apiLimiter } from './middleware/rateLimit';

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: config.clientUrl,
    credentials: true, // Allow cookies
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Global Rate Limiting for API
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

export default app;
