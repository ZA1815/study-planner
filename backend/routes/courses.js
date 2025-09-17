const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/db');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
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

router.get('/', auth, async (req, res) => {
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

router.put('/:id', auth, async (req, res) => {
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

router.delete('/:id', auth, async (req, res) => {
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

        res.status(200).send('Course deleted successfully');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;