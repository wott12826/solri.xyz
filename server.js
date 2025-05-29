const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(__dirname));

// Serve index.htm at the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.htm'));
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are SOLKR, a helpful AI assistant focused on blockchain and cryptocurrency topics. Keep responses concise and informative."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 150
    });

    res.json({ 
      text: completion.choices[0].message.content.trim()
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get response from OpenAI' });
  }
});

// For Vercel deployment
module.exports = app;

// Only start the server if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
  });
} 