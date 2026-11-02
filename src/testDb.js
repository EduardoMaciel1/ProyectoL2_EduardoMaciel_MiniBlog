const pool = require('./db');

const testDbConnection = async () => {
    try {

        const res = await pool.query('SELECT NOW()');
        console.log('Conexión exitosa. Fecha y hora actual:', res.rows[0]);
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    } finally {
        await pool.end();
    }
};

testDbConnection();