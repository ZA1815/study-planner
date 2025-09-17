const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/db');

router.post('/sign-up', async (req, res) => {
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

router.post('/login', async (req, res) => {
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

module.exports = router;