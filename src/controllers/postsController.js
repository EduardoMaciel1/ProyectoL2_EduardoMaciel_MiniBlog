const pool = require('../db');

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
            SELECT posts.*, authors.name as author_name, authors.email as author_email, authors.bio as author_bio 
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

        if (!title || !content || !author_id) {
            return res.status(400).json({ message: 'El título, el contenido y el ID del autor son obligatorios' });
        }

        const authorCheck = await pool.query('SELECT * FROM authors WHERE id = $1', [author_id]);
        if (authorCheck.rows.length === 0) {
            return res.status(404).json({ message: 'El autor especificado no existe' });
        }

        const isPublished = published !== undefined ? published : false;

        const query = `
            INSERT INTO posts (title, content, author_id, published) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `;
        const values = [title, content, author_id, isPublished];

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

        if (!title || !content || !author_id) {
            return res.status(400).json({ message: 'El título, el contenido y el ID del autor son obligatorios' });
        }

        const authorCheck = await pool.query('SELECT * FROM authors WHERE id = $1', [author_id]);
        if (authorCheck.rows.length === 0) {
            return res.status(400).json({ message: 'El autor especificado no existe o es inválido' });
        }

        const query = `
            UPDATE posts 
            SET title = $1, 
                content = $2, 
                author_id = $3, 
                published = COALESCE($4, published) 
            WHERE id = $5 
            RETURNING *
        `;
        const values = [title, content, author_id, published, id];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        return res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error('Error al actualizar la publicación:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM posts WHERE id = $1 RETURNING *';
        const values = [id];

        const result = await pool.query(query, values);

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
