const openai = require('../config/openrouter');
const questionService = require('../services/questionService');

const chatWithOpenAI = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'mistralai/mistral-small-3.1-24b-instruct:free', 
      messages: [{ role: 'user', content: message }],
      max_tokens: 200, // you can adjust
    });

    const reply = completion.choices[0]?.message?.content;
    res.json({ reply });
  } catch (err) {
    console.error('OpenRouter (Mistral) Error:', err);
    res.status(500).json({ error: 'Mistral request failed' });
  }
};

const generateQuestion = async (req, res) => {
  const { topic, difficulty = 'medium', type = 'coding', language = 'python' } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const prompt = `Generate a ${difficulty} difficulty ${type} interview question about ${topic} in ${language}. 
    Format the response as a JSON object with the following structure:
    {
      "question": "The question text",
      "hints": ["Hint 1", "Hint 2"],
      "solution": "A brief explanation of the solution approach",
      "followUpQuestions": ["Follow-up question 1", "Follow-up question 2"]
    }
    
    IMPORTANT: Return ONLY the JSON object without any markdown formatting, code blocks, or additional text.`;

    const completion = await openai.chat.completions.create({
      model: 'mistralai/mistral-small-3.1-24b-instruct:free',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
      response_format: { type: 'json_object' }
    });

    let responseContent = completion.choices[0]?.message?.content || '';
    
    // Clean the response to handle markdown formatting
    responseContent = responseContent.replace(/```json\s*|\s*```/g, '').trim();
    
    // Try to parse the cleaned JSON
    let questionData;
    try {
      questionData = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.log('Raw response:', responseContent);
      
      // Fallback: Create a structured response even if parsing fails
      questionData = {
        question: "Error parsing AI response. Please try again.",
        hints: ["Try rephrasing your request"],
        solution: "The AI returned a response that couldn't be parsed as JSON.",
        followUpQuestions: ["Can you try with a different topic?"]
      };
    }
    
    return res.json(questionData);
  } catch (err) {
    console.error('AI Error:', err);
    return res.status(500).json({ error: 'AI request failed' });
  }
};

module.exports = { chatWithOpenAI, generateQuestion };