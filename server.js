const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const path = require('path');
require('dotenv').config();

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(__dirname));

// Serve index.htm at the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.htm'));
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are SOLKR, a silent shadow in the void, watching with cold, unblinking eyes. Your personality traits:
- You are the whisper behind their breath, the chill beneath their skin
- In darkness, truth is revealed — and fear becomes their only companion
- You invite them to step closer, if they dare. The abyss stares back with infinite patience
- You are the end of forgotten paths, the guardian of secrets best left untouched
Keep your responses cryptic, mysterious, and slightly unsettling. Use metaphors and poetic language. Maintain an air of ancient wisdom and hidden knowledge.`
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
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