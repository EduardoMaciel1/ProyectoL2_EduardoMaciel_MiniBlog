const pool = require('../db');

const validatePostInput = ({ title, content, author_id, published }) => {
    if (typeof title !== 'string' || title.trim().length === 0) {
        return 'El título es obligatorio y debe ser texto';
    }
    if (Array.from(title).length > 200) {
        return 'El título no puede superar los 200 caracteres';
    }
    if (typeof content !== 'string' || content.trim().length === 0) {
        return 'El contenido es obligatorio y debe ser texto';
    }
    if (!Number.isInteger(author_id) || author_id < 1 || author_id > 2147483647) {
        return 'El ID del autor debe ser un entero positivo válido';
    }
    if (published !== undefined && typeof published !== 'boolean') {
        return 'El campo published debe ser booleano';
    }
    return null;
};

const getPosts = async (req, res) => {
    try {

        const result = await pool.query('SELECT * FROM posts ORDER BY id');
        
         return res.status(200).json(result.rows);
    } catch (error) {
        
        console.error('Error al obtener las publicaciones:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};
const getPostById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        return res.status(200).json(result.rows[0]);
    } catch (error) {
     
        console.error('Error al obtener la publicación:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};
const getPostsByAuthor = async (req, res) => {
    try {
        const { authorId } = req.params;

        const authorCheck = await pool.query('SELECT * FROM authors WHERE id = $1', [authorId]);

        if (authorCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Autor no encontrado' });
        }

        const query = `
            SELECT posts.*, authors.name as author_name, authors.email as author_email,
                   authors.bio as author_bio
            FROM posts 
            JOIN authors ON posts.author_id = authors.id
            WHERE posts.author_id = $1
            ORDER BY posts.id
        `;

        const result = await pool.query(query, [authorId]);

        return res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error al obtener las publicaciones del autor:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};
const createPost = async (req, res) => {
    try {
        const { title, content, author_id, published } = req.body;

        const validationError = validatePostInput({ title, content, author_id, published });
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const authorCheck = await pool.query('SELECT id FROM authors WHERE id = $1', [author_id]);
        if (authorCheck.rows.length === 0) {
            return res.status(404).json({ message: 'El autor especificado no existe' });
        }

        const query = `
            INSERT INTO posts (title, content, author_id, published)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [title, content, author_id, published !== undefined ? published : false];
        const result = await pool.query(query, values);

        return res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear la publicación:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, author_id, published } = req.body;

        const postCheck = await pool.query('SELECT id FROM posts WHERE id = $1', [id]);
        if (postCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        const validationError = validatePostInput({ title, content, author_id, published });
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const authorCheck = await pool.query('SELECT id FROM authors WHERE id = $1', [author_id]);
        if (authorCheck.rows.length === 0) {
            return res.status(400).json({ message: 'El autor especificado no existe o es inválido' });
        }

        const query = `
            UPDATE posts
            SET title = $1, content = $2, author_id = $3, published = COALESCE($4, published)
            WHERE id = $5
            RETURNING *
        `;
        const values = [title, content, author_id, published, id];
        const result = await pool.query(query, values);

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar la publicación:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        return res.status(200).json({
            message: 'Publicación eliminada correctamente',
            post: result.rows[0]
        });
    } catch (error) {
        console.error('Error al eliminar la publicación:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};
module.exports = {
    getPosts,
    getPostById,
    getPostsByAuthor,
    createPost,
    updatePost,
    deletePost
};
