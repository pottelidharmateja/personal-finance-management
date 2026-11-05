import request from 'supertest';
import assert from 'assert';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import FinanceRecord from '../src/models/FinanceRecord.js';
import User from '../src/models/user.js';

// The forecast route verifies tokens against JWT_SECRET; the login route
// signs with JWT_SECRET (falling back to 'defaultSecretKey' if unset).
// Set it here so both sides agree in tests.
process.env.JWT_SECRET = 'test-secret-for-forecast';

// Dynamic import inside before(): server.js connects to MongoDB (in-memory,
// test mode) as soon as it is imported, and it must load after the env
// above is set. A top-level await import would also break mocha's loader,
// so the import lives in the before() hook.
let server;

const waitForMongo = async (timeoutMs = 30000) => {
  const started = Date.now();
  while (mongoose.connection.readyState !== 1) {
    if (Date.now() - started > timeoutMs) throw new Error('MongoDB did not connect in time');
    await new Promise((r) => setTimeout(r, 200));
  }
};

const testUser = { email: 'forecast-test@example.com', password: 'password123' };
let jwtToken = '';
let userId = '';

describe('Forecast API Tests', () => {
  before(async () => {
    server = (await import('../server.js')).default;
    await waitForMongo();
    await request(server).post('/api/auth/signup').send(testUser);
    const login = await request(server).post('/api/auth/login').send(testUser);
    assert.strictEqual(login.status, 200);
    jwtToken = login.body.token;
    userId = jwt.decode(jwtToken).userId;
  });

  after(async () => {
    await User.deleteMany({});
    await FinanceRecord.deleteMany({});
    await mongoose.connection.close();
  });

  it('should forecast next month from the user ledger', async () => {
    const seed = [
      { title: 'Groceries', amount: 300, type: 'expense', date: new Date('2026-05-10'), userId },
      { title: 'Groceries', amount: 350, type: 'expense', date: new Date('2026-06-10'), userId },
      { title: 'Groceries', amount: 400, type: 'expense', date: new Date('2026-07-10'), userId },
      { title: 'Rent', amount: 1200, type: 'expense', date: new Date('2026-05-01'), userId },
      { title: 'Rent', amount: 1200, type: 'expense', date: new Date('2026-06-01'), userId },
      { title: 'Rent', amount: 1200, type: 'expense', date: new Date('2026-07-01'), userId },
      { title: 'Salary', amount: 4500, type: 'income', date: new Date('2026-07-01'), userId },
    ];
    await FinanceRecord.insertMany(seed);

    const res = await request(server)
      .get('/api/forecast')
      .set('Authorization', `Bearer ${jwtToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.next_month, '2026-08');
    // Groceries trending up (400 -> ~450) + Rent flat (1200)
    assert.ok(res.body.total_forecast > 1600, `total ${res.body.total_forecast} should exceed 1600`);
    const groceries = res.body.by_category.find((c) => c.category === 'Groceries');
    assert.ok(groceries, 'Groceries category present');
    assert.ok(groceries.forecast > 400, `groceries ${groceries.forecast} should exceed last month 400`);
    assert.ok(groceries.method.includes('linear trend'));
    const rent = res.body.by_category.find((c) => c.category === 'Rent');
    assert.strictEqual(rent.forecast, 1200);
    // Income must not be forecast as spending
    assert.strictEqual(res.body.by_category.find((c) => c.category === 'Salary'), undefined);
    assert.ok(res.body.generated_at, 'generated_at timestamp present');
  });

  it('should return an empty forecast for a user with no records', async () => {
    await FinanceRecord.deleteMany({ userId });
    const res = await request(server)
      .get('/api/forecast')
      .set('Authorization', `Bearer ${jwtToken}`);
    assert.strictEqual(res.status, 200);
    assert.deepStrictEqual(res.body.by_category, []);
  });

  it('should reject requests without a token', async () => {
    const res = await request(server).get('/api/forecast');
    assert.strictEqual(res.status, 401);
  });
});
