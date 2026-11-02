const pool = require('../db');

const getAuthors = async (req, res) => {
    try {
       
        const result = await pool.query('SELECT * FROM authors ORDER BY id');
        
       
        return res.status(200).json(result.rows);
    } catch (error) {
        
        console.error('Error al obtener los autores:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};
const getAuthorById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('SELECT * FROM authors WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Autor no encontrado' });
        }

        return res.status(200).json(result.rows[0]);
    } catch (error) {
       
        console.error('Error al obtener el autor:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const createAuthor = async (req, res) => {
    try {
       
        const { name, email, bio } = req.body;

        
        if (!name || !email) {
            return res.status(400).json({ message: 'El nombre y el correo son obligatorios' });
        }

        const query = 'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *';
        const values = [name, email, bio];
        
        const result = await pool.query(query, values);

        return res.status(201).json(result.rows[0]);
    } catch (error) {
        
        if (error.code === '23505') {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }

        console.error('Error al crear el autor:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const updateAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, bio } = req.body;

        
        if (!name || !email) {
            return res.status(400).json({ message: 'El nombre y el correo son obligatorios' });
        }

        const query = 'UPDATE authors SET name = $1, email = $2, bio = $3 WHERE id = $4 RETURNING *';
        const values = [name, email, bio, id];

        const result = await pool.query(query, values);

       
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Autor no encontrado' });
        }

        
        return res.status(200).json(result.rows[0]);

    } catch (error) {
        
        if (error.code === '23505') {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado por otro autor' });
        }

        console.error('Error al actualizar el autor:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};
const deleteAuthor = async (req, res) => {
    try {
        const { id } = req.params;

        const query = 'DELETE FROM authors WHERE id = $1 RETURNING *';
        const values = [id];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Autor no encontrado' });
        }

       
        return res.status(200).json({ 
            message: 'Autor eliminado correctamente', 
            author: result.rows[0] 
        });

    } catch (error) {
        console.error('Error al eliminar el autor:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};
module.exports = {
    getAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
};