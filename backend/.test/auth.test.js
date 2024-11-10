// test/auth.test.js

const request = require('supertest');
const app = require('../app'); // Assuming app.js is your main Express app
const User = require('../models/user');
const jwt = require('jsonwebtoken');

let testToken;

// Mocking the User model
jest.mock('../models/user');

beforeEach(() => {
  jest.clearAllMocks(); // Clear mock data between tests
});

describe('Auth Endpoints', () => {
  describe('POST /signup', () => {
    it('should create a new user successfully', async () => {
      User.findOne.mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue({ email: 'test@example.com' });

      const response = await request(app)
        .post('/signup')
        .send({ email: 'test@example.com', password: 'Password123' });

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('User created successfully!');
    });

    it('should return an error if email already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com' });

      const response = await request(app)
        .post('/signup')
        .send({ email: 'test@example.com', password: 'Password123' });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Email already exists. Please log in.');
    });

    it('should return an error if required fields are missing', async () => {
      const response = await request(app).post('/signup').send({ email: '' });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Please fill in all the required fields.');
    });
  });

  describe('POST /login', () => {
    it('should login successfully and return a token', async () => {
      const user = { _id: '123', email: 'test@example.com', password: '$2a$10$hashedPassword' };
      User.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const response = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'Password123' });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
      testToken = response.body.token; // Save token for later tests
    });

    it('should return an error for invalid password', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com', password: '$2a$10$hashedPassword' });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const response = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'WrongPassword' });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Invalid password. Try again.');
    });

    it('should return an error if user not found', async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/login')
        .send({ email: 'nonexistent@example.com', password: 'Password123' });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('User not found. Please sign up.');
    });
  });
});

// test/finance.test.js

const FinanceRecord = require('../models/FinanceRecord');

describe('Finance Endpoints', () => {
  describe('GET /records', () => {
    it('should fetch finance records for authenticated user', async () => {
      const financeRecords = [
        { userId: '123', amount: 500, description: 'Test record' },
      ];
      FinanceRecord.find = jest.fn().mockResolvedValue(financeRecords);

      const response = await request(app)
        .get('/records')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(financeRecords);
    });

    it('should return an error for unauthorized access', async () => {
      const response = await request(app).get('/records');

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('Authentication failed');
    });
  });
});

// test/profile.test.js

describe('User Profile Endpoints', () => {
  describe('GET /profile', () => {
    it('should fetch the profile of authenticated user', async () => {
      const user = { _id: '123', email: 'test@example.com', name: 'Test User' };
      User.findById = jest.fn().mockResolvedValue(user);

      const response = await request(app)
        .get('/profile')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(user);
    });

    it('should return error for invalid or missing token', async () => {
      const response = await request(app).get('/profile');

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe('No token provided. Authentication failed.');
    });
  });
});
