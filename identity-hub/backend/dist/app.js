"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const rateLimit_1 = require("./middleware/rateLimit");
const app = (0, express_1.default)();
// Security Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.config.clientUrl,
    credentials: true, // Allow cookies
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
// Global Rate Limiting for API
app.use('/api', rateLimit_1.apiLimiter);
// Routes
app.use('/api/auth', authRoutes_1.default);
// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});
exports.default = app;
