const express = require('express');
const router = express.Router();
const User = require('../Models/userModel');

// Route to handle user login
router.post('/', (req, res) => {
    const { username, password } = req.body;

    // Check username and password in the database
    User.findOne({ username, password })
        .then(result => {
            if (result) {
                res.send('Login successful');
            } else {
                res.status(401).send('Invalid username or password');
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
});

module.exports = router;
