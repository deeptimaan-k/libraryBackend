const express = require('express');
const router = express.Router();
const Student = require('../Models/studentModel');

// Route to fetch all student data
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();

        // Format the dateOfAdmission before sending the response
        const formattedStudents = students.map(student => ({
            ...student.toObject(),
            dateOfAdmission: student.dateOfAdmission.toISOString().substr(0, 10)
        }));

        res.json(formattedStudents);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

module.exports = router;
