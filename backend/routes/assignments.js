const express = require('express');
const router = express.Router({mergeParams: true});
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/db');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    const {name, dueDate} = req.body;
    const courseID = req.params.courseID;
    const userID = req.user.id;

    if (!name) {
        return res.status(400).send('Please provide a name for the assignment');
    }

    try {
        const course = await pool.query(
            'SELECT * FROM courses WHERE id = $1 AND user_id = $2',
            [courseID, userID]
        );
        
        if (course.rowCount === 0) {
            return res.status(404).send('Course not found');
        }

        const newAssignment = await pool.query(
            'INSERT INTO assignments (name, due_date, course_id) VALUES ($1, $2, $3) RETURNING *',
            [name, dueDate, courseID]
        );

        res.status(201).json(newAssignment.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/', auth, async (req, res) => {
    const courseID = req.params.courseID;
    const userID = req.user.id;

    try {
        const course = await pool.query(
            'SELECT * FROM courses WHERE id = $1 AND user_id = $2',
            [courseID, userID]
        );

        if (course.rowCount === 0) {
            return res.status(404).send('Course not found');
        }

        const assignments = await pool.query(
            'SELECT * FROM assignments WHERE course_id = $1 ORDER BY due_date ASC',
            [courseID]
        );

        res.status(200).json(assignments.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.put('/:id', auth, async (req, res) => {
    const {name, dueDate} = req.body;
    const courseID = req.params.courseID;
    const userID = req.user.id;
    const assignmentID = req.params.id;

    try {
        const course = await pool.query(
            'SELECT * FROM courses WHERE id = $1 AND user_id = $2',
            [courseID, userID]
        );

        if (course.rowCount === 0) {
            return res.status(404).send('Course not found');
        }

        const updatedAssignment = await pool.query(
            'UPDATE assignments SET name = $1, due_date = $2, updated_at = NOW() WHERE id = $3 AND course_id = $4 RETURNING *',
            [name, dueDate, assignmentID, courseID]
        );

        res.json({
            msg: 'Assignment updated successfully',
            data: updatedAssignment.rows[0]
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    const courseID = req.params.courseID;
    const assignmentID = req.params.id;
    const userID = req.user.id;

    try {
        const course = await pool.query(
            'SELECT * FROM courses WHERE id = $1 AND user_id = $2',
            [courseID, userID]
        );

        if (course.rowCount === 0) {
            return res.status(404).send('Course not found');
        }

        const deletedAssignment = await pool.query(
            'DELETE FROM assignments WHERE id = $1 AND course_id = $2',
            [assignmentID, courseID]
        );

        res.status(200).send('Assignment deleted successfully');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/all', auth, async (req, res) => {
    const userID = req.user.id;

    try {
        const assignments = await pool.query(
            'SELECT a.id, a.name, a.due_date, c.name AS course_name FROM assignments a JOIN courses c ON a.course_id = c.id WHERE c.user_id = $1 ORDER BY a.due_date ASC',
            [userID]
        );

        res.status(200).json(assignments.rows);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;