const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler.middleware');

const router = express.Router();

// Placeholder for chatbot routes
router.get('/', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Chatbot routes - Coming soon',
    data: []
  });
}));

module.exports = router;
