const express = require('express');
const router = express.Router();
const { chatWithOpenAI, generateQuestion } = require('../controllers/openaiController');
const questionService = require('../services/questionService');

// AI endpoints
router.post('/chat', chatWithOpenAI);
router.post('/generate-question', generateQuestion);

module.exports = router;