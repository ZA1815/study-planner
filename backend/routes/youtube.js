const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

router.get('/search', auth, async (req, res) => {
    const {searchTerm} = req.query;

    if (!searchTerm) {
        return res.status(400).send('Search query is required.');
    }

    try {
        const baseURL = 'https://www.googleapis.com/youtube/v3/search';
        const apiKey = process.env.YOUTUBE_API_KEY;

        const url = `${baseURL}?part=snippet&maxResults=3&q=${encodeURIComponent(searchTerm)}&key=${apiKey}`;

        const response = await axios.get(url);

        res.json(response.data.items);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');

    }
});

module.exports = router;