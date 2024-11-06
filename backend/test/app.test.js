import request from 'supertest';
import assert from 'assert';
import mongoose from 'mongoose';
import server from '../server.js';
import User from '../src/models/user.js';
import FinanceRecord from '../src/models/FinanceRecord.js';

// Test Data
const testUser = { email: 'testuser@example.com', password: 'password123' };
let jwtToken = '';

describe('Personal Finance Management App Backend Tests', () => {

  // Before all tests, connect to MongoDB
  before(async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  // After all tests, clear test data and close MongoDB connection
  after(async () => {
    await User.deleteMany({});
    await FinanceRecord.deleteMany({});
    await mongoose.connection.close();
  });
  it('should register a new user', async function() {
    this.timeout(5000); // Increase timeout to 5000ms or as needed
    const res = await request(server)
      .post('/api/auth/signup')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(testUser);
  
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.message, 'User created successfully!');
  });
  

  // Test: User Login
  it('should login a user and return a JWT token', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .set('Authorization', `Bearer ${jwtToken}`) // Ensure jwtToken is defined
      .send(testUser);

    assert.strictEqual(res.status, 200);
    assert.ok(res.body.token);
    jwtToken = res.body.token; // Save token for further tests
  });

  // Test: Create a Finance Record
  it('should create a new finance record', async () => {
    const res = await request(server)
      .post('/api/finance/records')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ title: 'Test Income', amount: 1000, type: 'income' });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.title, 'Test Income');
  });

  // Test: Fetch Finance Records
  it('should fetch finance records for the user', async () => {
    const res = await request(server)
      .get('/api/finance/records')
      .set('Authorization', `Bearer ${jwtToken}`);

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  // Test: Fetch User Profile
  it('should fetch user profile data', async () => {
    const res = await request(server)
      .get('/api/user/profile')
      .set('Authorization', `Bearer ${jwtToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.email, testUser.email);
  });

});
