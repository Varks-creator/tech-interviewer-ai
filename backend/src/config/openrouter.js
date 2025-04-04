const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1', // ✅ key difference from OpenAI
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5001', // or your actual frontend domain
    'X-Title': 'Tech Interview AI', // anything descriptive
  },
});

module.exports = openai;