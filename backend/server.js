require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const authRoutes = require('./src/routes/auth'); // Auth routes
const financeRoutes = require('./src/routes/Finance'); // Finance routes
const userRoutes = require('./src/routes/user'); // User routes

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Register Routes
app.use('/api/auth', authRoutes); // Register auth routes
app.use('/api/finance', financeRoutes); // Register finance routes
app.use('/api/user', userRoutes); // Register user routes

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Personal Finance Management API');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ error: 'An unexpected error occurred.' });
});

// Start the Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
