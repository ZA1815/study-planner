require('dotenv').config();
const express = require('express');
const pool = require('./db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
const app = express();
app.use(express.json());
const PORT = 3001;

app.get('/', (req, res) => {
    res.status(200).send('Hello, World!');
});

app.use('/api/users', require('./routes/users'));

app.get('/api/authentication', auth, (req, res) => {
    res.status(200).send(`Welcome user ${req.user.id}!`);
});

app.use('/api/courses', require('./routes/courses'));

app.use('/api/courses/:courseID/assignments', require('./routes/assignments'));

app.listen(PORT, () => {
    console.log(`Server is running and listening on http://localhost:${PORT}`);
});