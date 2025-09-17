require('dotenv').config();
const express = require('express');
const Pool = require('pg').Pool;
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    databse: process.env.DB_NAME
})
const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
    res.send('Hello, World!')
});

app.get('/testdb', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error connecting to the db');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running and listening on http://localhost:${PORT}`);
});