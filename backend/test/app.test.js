import request from 'supertest';
import assert from 'assert';
import server from '../server.js';  // Adjust this import to where your server is defined

describe('Personal Finance Management App Backend Routes', () => {
    let jwtToken = '';
    const testUser = { email: 'testuser@example.com', password: 'password123' };

    // Test: User Registration
    describe('POST /api/auth/signup', () => {
        it('should register a new user and return successful message', async () => {
            const res = await request(server)
                .post('/api/auth/signup')
                .send(testUser);
            assert.strictEqual(res.status, 201);
            assert.strictEqual(res.body.message, 'User created successfully!');
        });
    });

    // Test: User Login
    describe('POST /api/auth/login', () => {
        it('should login the user and return a JWT token', async () => {
            const res = await request(server)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });
            assert.strictEqual(res.status, 200);
            assert.ok(res.body.token, 'Token should be provided');
            jwtToken = res.body.token;  // Save the JWT token for further tests
        });
    });

    // Test: Create a Finance Record
    describe('POST /api/finance/records', () => {
        it('should create a new finance record', async () => {
            const res = await request(server)
                .post('/api/finance/records')
                .set('Authorization', `Bearer ${jwtToken}`)
                .send({ title: 'Test Income', amount: 1000, type: 'income' });
            assert.strictEqual(res.status, 201);
            assert.strictEqual(res.body.title, 'Test Income');
        });
    });

    // Test: Fetch Finance Records
    describe('GET /api/finance/records', () => {
        it('should fetch finance records for the user', async () => {
            const res = await request(server)
                .get('/api/finance/records')
                .set('Authorization', `Bearer ${jwtToken}`);
            assert.strictEqual(res.status, 200);
            assert.ok(Array.isArray(res.body), 'Response should be an array of records');
        });
    });

    // Test: Fetch User Profile
    describe('GET /api/user/profile', () => {
        it('should fetch user profile data', async () => {
            const res = await request(server)
                .get('/api/user/profile')
                .set('Authorization', `Bearer ${jwtToken}`);
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.body.email, testUser.email, 'Email should match the test user');
        });
    });
});
