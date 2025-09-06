const { body, param, query, validationResult } = require('express-validator');
const { handleValidationError } = require('./errorHandler.middleware');

// Validation result handler
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(handleValidationError(errors.array()));
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('role')
    .optional()
    .isIn(['user', 'admin', 'moderator'])
    .withMessage('Invalid role'),
  handleValidation
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidation
];

const validateUserUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name must be less than 100 characters'),
  handleValidation
];

// Campaign validation rules
const validateCampaign = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Campaign name must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('type')
    .isIn(['email', 'social', 'display', 'search', 'video', 'content'])
    .withMessage('Invalid campaign type'),
  body('status')
    .optional()
    .isIn(['draft', 'active', 'paused', 'completed', 'cancelled'])
    .withMessage('Invalid campaign status'),
  body('budget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  handleValidation
];

const validateCampaignUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Campaign name must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('status')
    .optional()
    .isIn(['draft', 'active', 'paused', 'completed', 'cancelled'])
    .withMessage('Invalid campaign status'),
  body('budget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  handleValidation
];

// Content validation rules
const validateContent = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long'),
  body('type')
    .isIn(['blog', 'social', 'email', 'ad', 'landing_page', 'video', 'image'])
    .withMessage('Invalid content type'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Invalid content status'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters'),
  handleValidation
];

const validateContentUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Invalid content status'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters'),
  handleValidation
];

// Analytics validation rules
const validateAnalyticsQuery = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  query('metric')
    .optional()
    .isIn(['impressions', 'clicks', 'conversions', 'revenue', 'roi', 'ctr', 'cpc', 'cpm'])
    .withMessage('Invalid metric'),
  query('groupBy')
    .optional()
    .isIn(['day', 'week', 'month', 'campaign', 'channel', 'audience'])
    .withMessage('Invalid groupBy value'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Limit must be between 1 and 1000'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer'),
  handleValidation
];

// Chatbot validation rules
const validateChatbotMessage = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('conversationId')
    .optional()
    .isUUID()
    .withMessage('Invalid conversation ID'),
  body('context')
    .optional()
    .isObject()
    .withMessage('Context must be an object'),
  handleValidation
];

// Social media validation rules
const validateSocialPost = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 280 })
    .withMessage('Content must be between 1 and 280 characters'),
  body('platform')
    .isIn(['twitter', 'facebook', 'linkedin', 'instagram'])
    .withMessage('Invalid platform'),
  body('scheduledAt')
    .optional()
    .isISO8601()
    .withMessage('Scheduled date must be a valid date'),
  body('media')
    .optional()
    .isArray()
    .withMessage('Media must be an array'),
  handleValidation
];

// ID parameter validation
const validateId = [
  param('id')
    .isUUID()
    .withMessage('Invalid ID format'),
  handleValidation
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidation
];

// Search validation
const validateSearch = [
  query('q')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  query('type')
    .optional()
    .isIn(['campaign', 'content', 'user', 'audience'])
    .withMessage('Invalid search type'),
  handleValidation
];

module.exports = {
  handleValidation,
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validateCampaign,
  validateCampaignUpdate,
  validateContent,
  validateContentUpdate,
  validateAnalyticsQuery,
  validateChatbotMessage,
  validateSocialPost,
  validateId,
  validatePagination,
  validateSearch
};
