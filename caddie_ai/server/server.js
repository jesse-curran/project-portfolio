require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const profileRoutes = require('./routes/profile');
const roundRoutes = require('./routes/rounds');
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
app.use(cors());

// Enhanced logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Request Body:', req.body);
  next();
});

// Authentication Routes (Page 1)
app.use('/api/auth', authRoutes);

// Profile Routes (Page 2)
app.use('/api/profile', profileRoutes);

// Course Routes (Page 2)
app.use('/api/courses', courseRoutes);

// Round Tracking Routes (Page 3)
app.use('/api/rounds', roundRoutes);

// Enhanced AI Caddy Advice route
app.post('/api/caddy-advice', async (req, res) => {
  try {
    const {
      holeNumber,
      shotNumber,
      distance,
      lieType,
      wind,
      userProfile // Include user's club distances and preferences
    } = req.body;

    const userMessage = `
      Hole ${holeNumber}, Shot ${shotNumber}
      Distance: ${distance} yards
      Lie: ${lieType}
      Wind Conditions: ${wind}
      Player Profile:
      - Handicap: ${userProfile.handicap}
      - Club Distances: ${JSON.stringify(userProfile.clubs)}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert golf caddy AI assistant. Provide specific club selection and shot advice based on the player's equipment, skill level, and current situation."
        },
        { role: "user", content: userMessage }
      ],
    });

    const advice = completion.choices[0].message.content;
    res.json({ advice });
  } catch (error) {
    console.error('AI Caddy Advice Error:', error);
    res.status(500).json({ 
      message: 'Error getting caddy advice',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    requestedUrl: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Error occurred:`, err);
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server with route documentation
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('\nAvailable Routes:');
  console.log('\nPage 1 - Authentication:');
  console.log('  POST /api/auth/register - Register new user');
  console.log('  POST /api/auth/login - User login');
  
  console.log('\nPage 2 - Profile & Course:');
  console.log('  GET /api/profile - Get user profile');
  console.log('  PUT /api/profile - Update user profile');
  console.log('  PUT /api/profile/clubs - Update club information');
  console.log('  PUT /api/profile/handicap - Update handicap');
  console.log('  GET /api/courses - Get available courses');
  console.log('  GET /api/courses/:id - Get specific course');
  
  console.log('\nPage 3 - Round Tracking:');
  console.log('  POST /api/rounds - Start new round');
  console.log('  GET /api/rounds/:id - Get round details');
  console.log('  PUT /api/rounds/:id/holes/:holeNumber - Update hole information');
  console.log('  POST /api/caddy-advice - Get AI caddy advice');
  console.log('  PUT /api/rounds/:id/complete - Complete round');
});