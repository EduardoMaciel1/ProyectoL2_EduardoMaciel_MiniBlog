const express = require('express');

const authorsRoutes = require('./routes/authorsRoutes');

const app = express();

app.use(express.json());

app.use('/authors', authorsRoutes);
const postsRoutes = require('./routes/postsRoutes');
app.use('/posts', postsRoutes);
module.exports = app;