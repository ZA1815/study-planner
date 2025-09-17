require('dotenv').config();
const express = require('express');
const Pool = require('pg').Pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
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
    res.status(200).send('Hello, World!');
});

app.post('/api/users/sign-up', async (req, res) => {
    const {user_name, email, password} = req.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    try {
        const newUser = await pool.query(
            'INSERT INTO users (user_name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
            [user_name, email, passwordHash]
        );
        res.status(201).json(newUser.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.post('/api/users/login', async (req, res) => {
    const {identifier, password} = req.body;

    try {
        const userID = await pool.query(
            'SELECT * FROM users WHERE user_name = $1 OR email = $1',
            [identifier]
        );
        
        if (userID.rows.length === 0) {
            return res.status(401).send('Invalid credentials');
        }

        const user = userID.rows[0];

        const passMatch = await bcrypt.compare(password, user.password_hash);

        if (!passMatch) {
            return res.status(401).send('Invalid credentials');
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );

        res.json({token});

    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/api/authentication', auth, (req, res) => {
    res.status(200).send(`Welcome user ${req.user.id}!`);
});

app.post('/api/courses', auth, async (req, res) => {
    const name = req.body.name;
    const userID = req.user.id;

    if (!name) {
        return res.status(400).send('Please provide a name for the course');
    }

    try {
        const newCourse = await pool.query(
            'INSERT INTO courses (user_id, name) VALUES ($1, $2) RETURNING *',
            [userID, name]
        )

        res.status(201).json(newCourse.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/api/courses', auth, async (req, res) => {
    try {
        const courses = await pool.query(
            'SELECT * FROM courses WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );

        res.status(200).json(courses.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.put('/api/courses/:id', auth, async (req, res) => {
    const name = req.body.name;
    const courseID = req.params.id;
    const userID = req.user.id;

    if (!name) {
        return res.status(400).send('Please provide a new name for the course');
    }

    try {
        const updatedCourse = await pool.query(
            'UPDATE courses SET name = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *',
            [name, courseID, userID]
        );

        if (updatedCourse.rowCount === 0) {
            return res.status(404).send('Course not found');
        }

        res.json({
            msg: 'Course updated successfully',
            data: updatedCourse.rows[0]
        });
    }
    catch (err) {
        console.error(err);
        res.send(500).send('Server Error');
    }
});

app.delete('/api/courses/:id', auth, async (req, res) => {
    const courseID = req.params.id;
    const userID = req.user.id;

    try {
        const deletedCourse = await pool.query(
            "DELETE FROM courses WHERE id = $1 AND user_id = $2",
            [courseID, userID]
        );

        if (deletedCourse.rowCount === 0) {
            return res.status(404).send('Course not found');
        }

        res.status(200).send('Course deleted successfully')
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/testdb', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error connecting to the db');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running and listening on http://localhost:${PORT}`);
});