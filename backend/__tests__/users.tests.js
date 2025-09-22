const request = require('supertest');
const express = require('express');

const app = express();

app.use(express.json());

app.use('/api/users', require('../routes/users'));
app.use('/api/courses', require('../routes/courses'));
app.use('/api/courses/:courseID/assignments', require('../routes/assignments'));
app.use('/api/assignments', require('../routes/assignments'));
app.use('/api/youtube', require('../routes/youtube'));

describe('API Endpoints', () => {
    test('should return 404 for a non-existent route', async () => {
        const response = await request(app).get('/api/nonexistent');
        expect(response.statusCode).toBe(404);
    });
});