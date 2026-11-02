const request = require('supertest');
const app = require('../src/app'); 
const pool = require('../src/db'); 

describe('GET /authors', () => {
    it('debería responder con estado 200 y una lista de autores', async () => {
        const response = await request(app).get('/authors');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

});
describe('GET /authors/:id', () => {
    it('responder con estado 200 y el autor si el ID existe', async () => {
        const authorId = 1;
        const response = await request(app).get(`/authors/${authorId}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
    });

    it('responder con estado 404 si el autor no existe', async () => {
        const response = await request(app).get('/authors/9999');
        
        expect(response.status).toBe(404);
    });
});

describe('POST /authors', () => {
    it('debería crear un autor con un correo único, responder con 201 y luego eliminarlo', async () => {
        const uniqueEmail = `test.author_${Date.now()}@example.com`;
        
        const response = await request(app)
            .post('/authors')
            .send({
                name: 'Autor de Prueba',
                email: uniqueEmail,
                bio: 'Biografía de prueba'
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('email', uniqueEmail);

        const authorId = response.body.id;
        await pool.query('DELETE FROM authors WHERE id = $1', [authorId]);
    });
});
afterAll(async () => {
    await pool.end();
});
