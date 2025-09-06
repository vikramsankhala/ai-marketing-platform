const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/environment');
const database = require('../config/database');
const logger = require('../utils/logger');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validateUserRegistration, validateUserLogin, validateUserUpdate } = require('../middleware/validation.middleware');
const { asyncHandler } = require('../middleware/errorHandler.middleware');

const router = express.Router();

// Register new user
router.post('/register', validateUserRegistration, asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, role = 'user' } = req.body;

  // Check if user already exists
  const existingUser = await database.query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );

  if (existingUser.rows.length > 0) {
    return res.status(409).json({
      success: false,
      message: 'User already exists with this email'
    });
  }

  // Hash password
  const saltRounds = config.BCRYPT_ROUNDS;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  const userId = uuidv4();
  const result = await database.query(
    `INSERT INTO users (id, email, password, first_name, last_name, role, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, 'active', NOW(), NOW())
     RETURNING id, email, first_name, last_name, role, status, created_at`,
    [userId, email, hashedPassword, firstName, lastName, role]
  );

  const user = result.rows[0];

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRATION }
  );

  // Generate refresh token
  const refreshToken = jwt.sign(
    { userId: user.id, type: 'refresh' },
    config.JWT_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRATION }
  );

  // Store refresh token
  await database.query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at, created_at) VALUES ($1, $2, $3, NOW())',
    [user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
  );

  logger.logBusinessEvent('user_registered', {
    userId: user.id,
    email: user.email,
    role: user.role
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        status: user.status,
        createdAt: user.created_at
      },
      token,
      refreshToken
    }
  });
}));

// Login user
router.post('/login', validateUserLogin, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Get user from database
  const result = await database.query(
    'SELECT id, email, password, first_name, last_name, role, status, last_login FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  const user = result.rows[0];

  // Check if user is active
  if (user.status !== 'active') {
    return res.status(401).json({
      success: false,
      message: 'Account is inactive'
    });
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    logger.logSecurityEvent('failed_login_attempt', {
      email,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Update last login
  await database.query(
    'UPDATE users SET last_login = NOW(), updated_at = NOW() WHERE id = $1',
    [user.id]
  );

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRATION }
  );

  // Generate refresh token
  const refreshToken = jwt.sign(
    { userId: user.id, type: 'refresh' },
    config.JWT_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRATION }
  );

  // Store refresh token
  await database.query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at, created_at) VALUES ($1, $2, $3, NOW())',
    [user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
  );

  logger.logBusinessEvent('user_login', {
    userId: user.id,
    email: user.email,
    ip: req.ip
  });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        status: user.status,
        lastLogin: user.last_login
      },
      token,
      refreshToken
    }
  });
}));

// Refresh token
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token required'
    });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Check if refresh token exists in database
    const tokenResult = await database.query(
      'SELECT user_id FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
      [refreshToken]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    // Get user data
    const userResult = await database.query(
      'SELECT id, email, role, status FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0 || userResult.rows[0].status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    const user = userResult.rows[0];

    // Generate new access token
    const newToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRATION }
    );

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }
    throw error;
  }
}));

// Logout user
router.post('/logout', authenticateToken, asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    // Remove refresh token from database
    await database.query(
      'DELETE FROM refresh_tokens WHERE token = $1',
      [refreshToken]
    );
  }

  logger.logBusinessEvent('user_logout', {
    userId: req.user.id,
    email: req.user.email
  });

  res.json({
    success: true,
    message: 'Logout successful'
  });
}));

// Get current user profile
router.get('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const result = await database.query(
    `SELECT id, email, first_name, last_name, role, status, phone, company, 
            created_at, updated_at, last_login
     FROM users WHERE id = $1`,
    [req.user.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const user = result.rows[0];

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        status: user.status,
        phone: user.phone,
        company: user.company,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        lastLogin: user.last_login
      }
    }
  });
}));

// Update user profile
router.put('/profile', authenticateToken, validateUserUpdate, asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, company } = req.body;
  const userId = req.user.id;

  const result = await database.query(
    `UPDATE users 
     SET first_name = COALESCE($1, first_name),
         last_name = COALESCE($2, last_name),
         phone = COALESCE($3, phone),
         company = COALESCE($4, company),
         updated_at = NOW()
     WHERE id = $5
     RETURNING id, email, first_name, last_name, role, status, phone, company, updated_at`,
    [firstName, lastName, phone, company, userId]
  );

  const user = result.rows[0];

  logger.logBusinessEvent('user_profile_updated', {
    userId: user.id,
    email: user.email
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        status: user.status,
        phone: user.phone,
        company: user.company,
        updatedAt: user.updated_at
      }
    }
  });
}));

// Change password
router.put('/change-password', authenticateToken, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required'
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 8 characters long'
    });
  }

  // Get current password hash
  const result = await database.query(
    'SELECT password FROM users WHERE id = $1',
    [req.user.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, result.rows[0].password);
  if (!isCurrentPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Hash new password
  const saltRounds = config.BCRYPT_ROUNDS;
  const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

  // Update password
  await database.query(
    'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
    [hashedNewPassword, req.user.id]
  );

  logger.logSecurityEvent('password_changed', {
    userId: req.user.id,
    email: req.user.email
  });

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
}));

// Delete account
router.delete('/account', authenticateToken, asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Password is required to delete account'
    });
  }

  // Get current password hash
  const result = await database.query(
    'SELECT password FROM users WHERE id = $1',
    [req.user.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, result.rows[0].password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Password is incorrect'
    });
  }

  // Soft delete user (set status to deleted)
  await database.query(
    'UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2',
    ['deleted', req.user.id]
  );

  // Remove all refresh tokens
  await database.query(
    'DELETE FROM refresh_tokens WHERE user_id = $1',
    [req.user.id]
  );

  logger.logBusinessEvent('user_account_deleted', {
    userId: req.user.id,
    email: req.user.email
  });

  res.json({
    success: true,
    message: 'Account deleted successfully'
  });
}));

module.exports = router;
