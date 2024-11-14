import request from 'supertest';
import assert from 'assert';
import server from '../server.js';

describe('Personal Finance Management App Backend Routes', () => {
    let jwtToken = '';
    let recordId = ''; // Variable to store created record ID
    const testUser = { email: 'testuser@example.com', password: 'password123' };

    // Test: Fetch Finance Records
    describe('GET /api/finance/records', () => {

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

        it('should return 401 if no token is provided', async () => {
            const res = await request(server)
                .get('/api/user/profile');
            assert.strictEqual(res.status, 401);
        });
    });
});
