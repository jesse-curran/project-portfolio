require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const profileRoutes = require('./routes/profile');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3006;

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
app.use('/api/profile', profileRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Golf Caddy API is running');
});

// AI Caddy Advice route
app.post('/api/caddy-advice', async (req, res) => {
  try {
    const {
      holeNumber,
      shotNumber,
      distance,
      lieType,
      lieAngle,
      windSpeed,
      windDirection,
      par,
      handicap,
      holeDistance,
      holeDescription,
      recommendedClub,
      userClubs
    } = req.body;
    //The calculated recommendedClub by sorting my club distances is ${recommendedClub}.
    // Format clubs list for the prompt
    const clubsList = userClubs
      .map(club => `${club.name}: ${club.distance} yards`)
      .join('\n');

    const userMessage = `
      I'm on hole ${holeNumber} (${holeDistance} yards, par ${par}), shot ${shotNumber}.
      ${holeDescription ? `Hole description: ${holeDescription}` : ''}
      I'm ${distance} yards from the pin.
      The ball is on the ${lieType} with a ${lieAngle} lie.
      Wind conditions: ${windSpeed} mph ${windDirection}.
      My handicap is ${handicap}.
      My available clubs and their distances are: ${clubsList}.
      

      The main question to answer in your response: 
      Based on the clubs in my bag and each of their distances, what shot should I try to hit given my distance, shot number, lie type and lie angle, wind conditions, and my handicap?
      
      Example Response, follow this outline closely. Notice example is robot like, concise: Factoring in golf shot variables, my recommendation is a 7 iron at about 80%. From 156 yards out, with wind light and in your face, and the lie preferrable on the fairway, your normal 7 iron distance of 165 swung at 80% should give you the correct distance, lower flight and spin, with exactly what we want. Good luck you got this!
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are an expert golf caddy AI assistant. Provide specific, actionable advice considering the player's skill level (handicap), their club distances, and current conditions. Be concise but thorough." 
        },
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