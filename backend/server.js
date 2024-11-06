import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.js';
import financeRoutes from './src/routes/Finance.js';
import userRoutes from './src/routes/user.js';
import userInputRoutes from './src/routes/userinput.js';
import { MongoMemoryServer } from 'mongodb-memory-server'; // Import in-memory server

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

// Function to connect to MongoDB
const connectToMongoDB = async () => {
  console.time("MongoDB Connection Time"); // Start logging time

  try {
    if (process.env.NODE_ENV === 'test') {
      // Use in-memory MongoDB for tests
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log("Connected to in-memory MongoDB for tests");
    } else {
      // Use MongoDB Atlas URI for non-test environments
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected to MongoDB Atlas");
    }
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  } finally {
    console.timeEnd("MongoDB Connection Time"); // End logging time
  }
};

// Call MongoDB connection function
connectToMongoDB();

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/user-inputs', userInputRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Personal Finance Management API');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ error: 'An unexpected error occurred.' });
});

// Start the Server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

export default app;
