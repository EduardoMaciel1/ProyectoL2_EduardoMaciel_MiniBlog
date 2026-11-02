const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const authorsRoutes = require('./routes/authorsRoutes');

const app = express();

app.use(express.json());

app.use('/authors', authorsRoutes);
const postsRoutes = require('./routes/postsRoutes');
app.use('/posts', postsRoutes);
app.get('/openapi.yaml', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'openapi.yaml'));
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, {
    customSiteTitle: 'MiniBlog API - Swagger UI',
    swaggerOptions: {
        url: '/openapi.yaml'
    }
}));

module.exports = app;