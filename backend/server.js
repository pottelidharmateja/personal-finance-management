const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import Routes
const authRoutes = require('./src/routes/auth'); // Ensure correct path
const financeRoutes = require('./src/routes/Finance'); // Ensure correct path

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse incoming JSON requests

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/personal-finance', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api/finance', financeRoutes); // Finance routes

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Personal Finance Management API');
});

// Start the Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
