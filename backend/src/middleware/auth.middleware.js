const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const logger = require('../utils/logger');
const database = require('../config/database');

// JWT Authentication Middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Get user from database
    const userResult = await database.query(
      'SELECT id, email, role, status, last_login FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = userResult.rows[0];

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      lastLogin: user.last_login
    };

    next();
  } catch (error) {
    logger.logError(error, { middleware: 'authenticateToken' });
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.logSecurityEvent('Unauthorized access attempt', {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: roles,
        endpoint: req.originalUrl
      });

      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      
      const userResult = await database.query(
        'SELECT id, email, role, status FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (userResult.rows.length > 0 && userResult.rows[0].status === 'active') {
        req.user = userResult.rows[0];
      }
    }
  } catch (error) {
    // Silently ignore authentication errors for optional auth
    logger.debug('Optional auth failed', { error: error.message });
  }

  next();
};

// API Key authentication middleware
const authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API key required'
      });
    }

    // Check API key in database
    const keyResult = await database.query(
      'SELECT id, user_id, name, permissions, expires_at FROM api_keys WHERE key = $1 AND active = true',
      [apiKey]
    );

    if (keyResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API key'
      });
    }

    const apiKeyData = keyResult.rows[0];

    // Check if API key is expired
    if (apiKeyData.expires_at && new Date() > new Date(apiKeyData.expires_at)) {
      return res.status(401).json({
        success: false,
        message: 'API key expired'
      });
    }

    // Get user data
    const userResult = await database.query(
      'SELECT id, email, role, status FROM users WHERE id = $1',
      [apiKeyData.user_id]
    );

    if (userResult.rows.length === 0 || userResult.rows[0].status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    req.user = userResult.rows[0];
    req.apiKey = apiKeyData;

    next();
  } catch (error) {
    logger.logError(error, { middleware: 'authenticateApiKey' });
    return res.status(500).json({
      success: false,
      message: 'API key authentication error'
    });
  }
};

// Rate limiting per user
const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user.id;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    for (const [key, value] of requests.entries()) {
      if (value.timestamp < windowStart) {
        requests.delete(key);
      }
    }

    // Check current user's requests
    const userRequests = requests.get(userId) || { count: 0, timestamp: now };
    
    if (userRequests.timestamp < windowStart) {
      userRequests.count = 0;
      userRequests.timestamp = now;
    }

    if (userRequests.count >= maxRequests) {
      logger.logSecurityEvent('Rate limit exceeded', {
        userId,
        maxRequests,
        windowMs,
        endpoint: req.originalUrl
      });

      return res.status(429).json({
        success: false,
        message: 'Rate limit exceeded',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    userRequests.count++;
    requests.set(userId, userRequests);

    next();
  };
};

module.exports = {
  authenticateToken,
  authorize,
  optionalAuth,
  authenticateApiKey,
  userRateLimit
};
