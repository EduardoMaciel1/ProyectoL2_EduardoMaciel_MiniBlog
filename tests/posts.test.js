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
        const postId = 1;
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

    it('debería crear una publicación, eliminarla con DELETE, verificar el estado 200 y comprobar con GET que ya no existe (404)', async () => {
        let postId;
        try {
            const uniqueTitle = `Publicación a Eliminar ${Date.now()}`;
            const createResponse = await request(app)
                .post('/posts')
                .send({
                    title: uniqueTitle,
                    content: 'Contenido para eliminar',
                    author_id: 4,
                    published: true
                });

            postId = createResponse.body.id;

            const deleteResponse = await request(app).delete(`/posts/${postId}`);
            expect(deleteResponse.status).toBe(200);

            const getResponse = await request(app).get(`/posts/${postId}`);
            expect(getResponse.status).toBe(404);

        } finally {
            if (postId) {
                await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
            }
        }
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

    it('debería responder con estado 400 al intentar crear una publicación sin el campo content', async () => {
        const response = await request(app)
            .post('/posts')
            .send({
                title: 'Publicación sin contenido',
                author_id: 4,
                published: true
            });

        expect(response.status).toBe(400);
    });

    it('debería responder con estado 404 al intentar crear una publicación con un author_id inexistente', async () => {
        const response = await request(app)
            .post('/posts')
            .send({
                title: 'Publicación con autor inválido',
                content: 'Contenido de prueba',
                author_id: 99999,
                published: true
            });

        expect(response.status).toBe(404);
    });
});

describe('PUT /posts/:id', () => {
    it('debería crear una publicación, actualizarla con PUT, verificar el estado 200 y el nuevo título, y luego eliminarla', async () => {
        const uniqueTitle = `Publicación Inicial ${Date.now()}`;
        const createResponse = await request(app)
            .post('/posts')
            .send({
                title: uniqueTitle,
                content: 'Contenido inicial',
                author_id: 4,
                published: false
            });

        const postId = createResponse.body.id;

        const updatedTitle = `Publicación Actualizada ${Date.now()}`;
        const updateResponse = await request(app)
            .put(`/posts/${postId}`)
            .send({
                title: updatedTitle,
                content: 'Contenido actualizado',
                author_id: 4,
                published: true
            });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body).toHaveProperty('title', updatedTitle);

        await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
    });
});

afterAll(async () => {
    await pool.end();
});