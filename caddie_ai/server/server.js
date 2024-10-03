require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(express.json());

// Logging middleware (for debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
  next();
});

const cors = require('cors');
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Golf Caddy API is running');
});

// AI Caddy Advice route
app.post('/api/caddy-advice', async (req, res) => {
  try {
    const { holeNumber, distance, weather } = req.body;
    const userMessage = `I'm on hole ${holeNumber}, ${distance} yards from the pin, and the weather is ${weather}. What's your advice?`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert golf caddy AI assistant. Provide concise, helpful advice for golfers based on their current golf shot." },
        { role: "user", content: userMessage }
      ],
    });

    const advice = completion.choices[0].message.content;
    res.json({ advice });
  } catch (error) {
    console.error('AI Caddy Advice Error:', error);
    res.status(500).json({ message: 'Error getting caddy advice' });
  }
});

// Catch-all route for undefined routes (debugging)
app.use('*', (req, res) => {
  console.log(`Route not found: ${req.originalUrl}`);
  res.status(404).json({
    message: 'Route not found',
    requestedUrl: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Error occurred: ${err.stack}`);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('  /api/auth/register (POST)');
  console.log('  /api/auth/login (POST)');
  console.log('  /api/courses (GET)');
  console.log('  /api/courses/:id (GET)');
  console.log('  /api/caddy-advice (POST)');
});