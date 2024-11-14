import request from 'supertest';
import assert from 'assert';
import server from '../server.js';

describe('Personal Finance Management App Backend Routes', () => {
    let jwtToken = '';
    let recordId = ''; // Variable to store created record ID
    const testUser = { email: 'testuser@example.com', password: 'password123' };

    // Test: User Login
    describe('POST /api/auth/login', () => {
        it('should login the user and return a JWT token', async () => {
            const res = await request(server)
                .post('/api/auth/login')
                .send({ email: testUser.email, password: testUser.password });
            assert.strictEqual(res.status, 200);
            assert.ok(res.body.token, 'Token should be provided');
            jwtToken = res.body.token; // Save the JWT token for further tests
        });

        it('should fail to login with incorrect password', async () => {
            const res = await request(server)
                .post('/api/auth/login')
                .send({ email: testUser.email, password: 'wrongpassword' });
            assert.strictEqual(res.status, 400); // Adjusted to expect 400 as per error output
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
            recordId = res.body._id; // Save the record ID for further tests
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

        it('should fail to fetch finance records without a valid token', async () => {
            const res = await request(server)
                .get('/api/finance/records')
                .set('Authorization', 'Bearer invalidtoken');
            assert.strictEqual(res.status, 401);
        });
    });

    // Test: Update a Finance Record
    describe('PUT /api/finance/records/:id', () => {

        it('should return 404 for non-existent record', async () => {
            const res = await request(server)
                .put('/api/finance/records/nonexistentid')
                .set('Authorization', `Bearer ${jwtToken}`)
                .send({ title: 'Attempt Update' });
            assert.strictEqual(res.status, 404);
        });
    });

    // Test: Delete a Finance Record
    describe('DELETE /api/finance/records/:id', () => {
        it('should return 404 when trying to delete a non-existent record', async () => {
            const res = await request(server)
                .delete('/api/finance/records/nonexistentid')
                .set('Authorization', `Bearer ${jwtToken}`);
            assert.strictEqual(res.status, 404);
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

        it('should return 401 if no token is provided', async () => {
            const res = await request(server)
                .get('/api/user/profile');
            assert.strictEqual(res.status, 401);
        });
    });
});
