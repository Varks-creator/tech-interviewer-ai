const express = require('express');
const router = express.Router();
const protectedRoute = require('../middlewares/authMiddleware');

// Protected route that requires authentication
router.get('/', protectedRoute, (req, res) => {
  res.send('Hello World');
});

// Public test endpoint that doesn't require authentication
router.get('/public', (req, res) => {
  res.json({
    message: 'Public test endpoint is working!',
    timestamp: new Date().toISOString(),
    serverInfo: {
      nodeVersion: process.version,
      platform: process.platform
    }
  });
});

module.exports = router;