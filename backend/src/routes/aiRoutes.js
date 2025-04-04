const express = require('express');
const router = express.Router();
const { chatWithOpenAI } = require('../controllers/openaiController');

router.post('/chat', chatWithOpenAI);

module.exports = router;
