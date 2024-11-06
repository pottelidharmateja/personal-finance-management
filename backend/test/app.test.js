import request from 'supertest';
import assert from 'assert';
import mongoose from 'mongoose';
import server from '../server.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../src/models/user.js';
import FinanceRecord from '../src/models/FinanceRecord.js';
import UserInput from '../src/models/userinput.js';

// Test Data
const testUser = { email: 'testuser@example.com', password: 'password123' };
let jwtToken = '';
let mongoServer;

describe('Personal Finance Management App Backend Tests', () => {
  // Before all tests, start in-memory MongoDB and connect
  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  // After all tests, clear test data and close MongoDB connection
  after(async () => {
    await User.deleteMany({});
    await FinanceRecord.deleteMany({});
    await mongoose.connection.close();
    await mongoServer.stop(); // Stop in-memory MongoDB
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
      .set('Authorization', `Bearer ${jwtToken}`)
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
  describe('FinanceRecord Model Tests', () => {
    // Test: Creating a valid finance record
    it('should create a valid finance record', async () => {
      const financeRecordData = {
        userId: new mongoose.Types.ObjectId(), // Use 'new' to create a valid ObjectId
        title: 'Salary Payment',
        amount: 3000,
        type: 'income',
        date: new Date(),
      };
  
      const financeRecord = new FinanceRecord(financeRecordData);
      const savedRecord = await financeRecord.save();
  
      assert.strictEqual(savedRecord.title, financeRecordData.title);
      assert.strictEqual(savedRecord.amount, financeRecordData.amount);
      assert.strictEqual(savedRecord.type, financeRecordData.type);
      assert.ok(savedRecord._id); // Ensure an ID was created
    });
  
    // Test: Missing required fields (e.g., title)
    it('should throw a validation error if required fields are missing', async () => {
      const incompleteData = {
        userId: new mongoose.Types.ObjectId(), // Use 'new' to create a valid ObjectId
        amount: 500,
        type: 'expense',
      };
  
      try {
        const financeRecord = new FinanceRecord(incompleteData);
        await financeRecord.save();
        assert.fail('Expected validation error was not thrown');
      } catch (error) {
        assert.ok(error.errors.title); // Check that the error is for the missing title field
        assert.strictEqual(error.errors.title.kind, 'required');
      }
    });
  });
  describe('User Model Tests', () => {
    beforeEach(async () => {
      await User.deleteMany({});
    });
    it('should create a user with valid data', async () => {
      const user = new User(testUser);
      const savedUser = await user.save();

      assert.strictEqual(savedUser.email, testUser.email);
      assert.strictEqual(savedUser.password, testUser.password);
      assert.ok(savedUser._id); // Ensure an ID is created
    });

    it('should throw validation error if required fields are missing in User', async () => {
      const incompleteUserData = { password: 'password123' }; // Missing email

      try {
        const user = new User(incompleteUserData);
        await user.save();
        assert.fail('Expected validation error was not thrown');
      } catch (error) {
        assert.ok(error.errors.email); // Check for missing email error
        assert.strictEqual(error.errors.email.kind, 'required');
      }
    });
  });
  describe('UserInput Model Tests', () => {
    let userId;
  
    // Create a user to reference in each UserInput test
    beforeEach(async () => {
      await User.deleteMany({});
      await UserInput.deleteMany({});
  
      const user = new User(testUser);
      const savedUser = await user.save();
      userId = savedUser._id; // Save userId for reference
    });
  
    it('should create a UserInput document with valid data', async () => {
      const userInputData = {
        userId,
        income: 5000,
        rent: 1200,
        groceries: 300,
        food: 150,
        wifi: 50,
        electricity: 100,
        credit: 200,
      };
  
      const userInput = new UserInput(userInputData);
      const savedUserInput = await userInput.save();
  
      assert.strictEqual(savedUserInput.userId.toString(), userId.toString());
      assert.strictEqual(savedUserInput.income, userInputData.income);
      assert.strictEqual(savedUserInput.rent, userInputData.rent);
      assert.strictEqual(savedUserInput.groceries, userInputData.groceries);
      assert.ok(savedUserInput._id); // Ensure an ID is created
    });
  
    it('should throw validation error if required fields are missing in UserInput', async () => {
      const incompleteUserInputData = {
        userId,
        rent: 1200,
        groceries: 300,
        food: 150,
        wifi: 50,
        electricity: 100,
        credit: 200,
      }; // Missing income
  
      try {
        const userInput = new UserInput(incompleteUserInputData);
        await userInput.save();
        assert.fail('Expected validation error was not thrown');
      } catch (error) {
        assert.ok(error.errors.income); // Check for missing income error
        assert.strictEqual(error.errors.income.kind, 'required');
      }
    });
  });  
});
