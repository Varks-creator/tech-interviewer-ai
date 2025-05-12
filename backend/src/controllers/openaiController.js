// const openai = require('../config/openrouter');

// const chatWithOpenAI = async (req, res) => {
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ error: 'Message is required' });
//   }

//   try {
//     const completion = await openai.chat.completions.create({
//       model: 'mistralai/mistral-small-3.1-24b-instruct:free', 
//       messages: [{ role: 'user', content: message }],
//       max_tokens: 200, // you can adjust
//     });

//     const reply = completion.choices[0]?.message?.content;
//     res.json({ reply });
//   } catch (err) {
//     console.error('OpenRouter (Qwen2.5) Error:', err);
//     res.status(500).json({ error: 'Qwen request failed' });
//   }
// };

// module.exports = { chatWithOpenAI };