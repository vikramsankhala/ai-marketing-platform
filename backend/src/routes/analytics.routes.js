const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler.middleware');

const router = express.Router();

// Placeholder for analytics routes
router.get('/', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Analytics routes - Coming soon',
    data: []
  });
}));

module.exports = router;
