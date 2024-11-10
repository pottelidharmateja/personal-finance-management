require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const authRoutes = require('./src/routes/auth'); // Auth routes
const financeRoutes = require('./src/routes/Finance'); // Finance routes
const userRoutes = require('./src/routes/user'); // User routes
const aiRoutes = require('./src/routes/ai'); // AI routes

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json({ limit: '10mb' })); // Parse incoming JSON requests with increased limit for AI processing
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Support URL-encoded bodies

// Verify OpenAI API Key
if (!process.env.OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY is not set in environment variables');
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  connectTimeoutMS: 10000, // 10 seconds connection timeout
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Register Routes
app.use('/api/auth', authRoutes); // Register auth routes
app.use('/api/finance', financeRoutes); // Register finance routes
app.use('/api/user', userRoutes); // Register user routes
app.use('/api/ai', aiRoutes); // Register AI routes

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Personal Finance Management API with AI capabilities');
});

// AI-specific error handler
app.use('/api/ai/*', (err, req, res, next) => {
  if (err.name === 'OpenAIError') {
    console.error('OpenAI API Error:', err);
    return res.status(503).json({ 
      error: 'AI Service Temporarily Unavailable',
      message: 'The AI service is currently unavailable. Please try again later.'
    });
  }
  next(err);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  
  // Handle different types of errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Validation Error', 
      details: err.message 
    });
  }
  
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    return res.status(503).json({ 
      error: 'Database Error',
      message: 'A database error occurred. Please try again later.'
    });
  }

  // Default error response
  res.status(500).json({ 
    error: 'An unexpected error occurred.',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Please try again later.'
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Implement any cleanup/logging logic here
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Implement any cleanup/logging logic here
  process.exit(1);
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('AI capabilities enabled');
});