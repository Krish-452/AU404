const jwt = require('jsonwebtoken');
const User = require('../models/User');
const cache = require('../services/cache');
const logger = require('../services/logger');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    try {
        // Cache JWT verification
        const cacheKey = `token:${token}`;
        let decoded = await cache.get(cacheKey);

        if (!decoded) {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Cache for 1 hour
            await cache.set(cacheKey, decoded, 3600);
        }

        // Keep DB fetch for backward compatibility with controllers needing full user
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            logger.warn('Token expired');
            return res.status(401).json({ message: 'Token expired' });
        }
        logger.error("Auth Middleware Error:", err);
        return res.status(401).json({ message: 'Not authorized to access this route' });
    }
};

module.exports = { protect };
