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
dotenv.config();

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5500;

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/ExpenseRoutes', ExpenseRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/user-inputs', userInputRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Personal Finance Management API');
});

// Temporary route to test global error handler
app.get('/error-test', (req, res, next) => {
  next(new Error('This is a test error'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.message);
  res.status(500).json({ error: 'An unexpected error occurred.' });
});

// Start the Server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
}

export default app;
