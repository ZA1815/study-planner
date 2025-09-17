require('dotenv').config();
const express = require('express');
const Pool = require('pg').Pool;
const bcrypt = require('bcrypt');
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    databse: process.env.DB_NAME
});
const app = express();
app.use(express.json());
const PORT = 3001;

app.get('/', (req, res) => {
    res.send('Hello, World!')
});

app.post('/api/users/sign-up', async (req, res) => {
    const {user_name, email, password} = req.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    try {
        const newUser = await pool.query(
            "INSERT INTO users (user_name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
            [user_name, email, passwordHash]
        );
        res.status(201).json(newUser.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
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