const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/db');

describe('GET /posts', () => {
    it('debería responder con estado 200 y una lista de publicaciones', async () => {
        const response = await request(app).get('/posts');
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe('GET /posts/:id', () => {
    it('debería responder con estado 200 y la publicación si el ID existe', async () => {
        const postId = 1; // Asegúrate de que este ID exista en tu tabla posts
        const response = await request(app).get(`/posts/${postId}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
    });

    it('debería responder con estado 404 si la publicación no existe', async () => {
        const response = await request(app).get('/posts/9999');
        
        expect(response.status).toBe(404);
    });
});

describe('DELETE /posts/:id', () => {
    it('debería responder con estado 404 al intentar eliminar una publicación inexistente', async () => {
        const response = await request(app).delete('/posts/9999');
        
        expect(response.status).toBe(404);
    });
});
describe('POST /posts', () => {
    it('debería crear una publicación con título único, responder con 201 y luego eliminarla', async () => {
        const uniqueTitle = `Publicación de Prueba ${Date.now()}`;
        
        const response = await request(app)
            .post('/posts')
            .send({
                title: uniqueTitle,
                content: 'Contenido de la publicación de prueba',
                author_id: 4,
                published: true
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('title', uniqueTitle);

        const postId = response.body.id;
        await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
    });
});
afterAll(async () => {
    await pool.end();
});