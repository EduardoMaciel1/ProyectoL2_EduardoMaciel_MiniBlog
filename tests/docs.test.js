const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/db');

describe('Documentación Swagger', () => {
    it('debería servir Swagger UI', async () => {
        const response = await request(app).get('/api-docs/');

        expect(response.status).toBe(200);
        expect(response.text).toContain('Swagger UI');
    });

    it('debería servir la especificación OpenAPI', async () => {
        const response = await request(app).get('/openapi.yaml');

        expect(response.status).toBe(200);
        expect(response.text).toContain('openapi: 3.0.3');
        expect(response.text).toContain('/authors');
    });
});

afterAll(async () => {
    await pool.end();
});
