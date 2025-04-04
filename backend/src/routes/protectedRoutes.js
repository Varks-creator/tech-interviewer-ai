const express = require('express');
const router = express.Router();
const verifyFirebaseToken = require('../middlewares/authMiddleware');

// Example protected route
router.get('/me', verifyFirebaseToken, (req, res) => {
  res.json({
    message: 'You are authenticated!',
    uid: req.user.uid,
    email: req.user.email,
    name: req.user.name || 'Anonymous',
  });
});

module.exports = router;
