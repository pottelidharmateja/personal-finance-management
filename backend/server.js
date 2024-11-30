import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.js';
import financeRoutes from './src/routes/Finance.js';
import userRoutes from './src/routes/user.js';
import userInputRoutes from './src/routes/userinput.js';
import ExpenseRoutes from './src/routes/ExpenseRoutes.js';

// Load environment variables from .env file
dotenv.config({ path: '/Users/pottelidharmateja/Personal Finance Management/personal-finance-management/backend/.env' });


// Debug: Log environment variables for verification
console.log('Environment Variables Loaded:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Loaded' : 'Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'Missing');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Loaded Successfully' : 'Not Loaded');

// Exit if essential environment variables are missing
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'OPENAI_API_KEY'];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.error(`Error: Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5500;

// Middleware: CORS Configuration
app.use(
  cors({
    origin: 'http://localhost:3000', // Adjust origin based on your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Extended HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Middleware: JSON Parsing
app.use(express.json());

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ExpenseRoutes', ExpenseRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/user-inputs', userInputRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Personal Finance Management API');
});

// Temporary Error Test Route
app.get('/error-test', (req, res, next) => {
  next(new Error('This is a test error'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err.message);
  res.status(500).json({ error: 'An unexpected error occurred.' });
});

// Connect to MongoDB and Start the Server
async function startServer() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

// Graceful Shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error during shutdown:', err.message);
  }
  process.exit(0);
});

export default app;
