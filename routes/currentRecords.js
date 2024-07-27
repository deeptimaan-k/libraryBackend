const express = require('express');
const router = express.Router();
const Student = require('../Models/studentModel');

// Route to fetch all student data
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();

        console.log('Fetched all students:', students); // Debug log

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

// Route to fetch student data based on search criteria
router.post('/search', async (req, res) => {
    try {
        const searchCriteria = req.body;
        const query = {};

        // Dynamically create the query object based on search criteria
        for (const key in searchCriteria) {
            if (searchCriteria[key]) {
                query[key] = { $regex: new RegExp(searchCriteria[key], 'i') };
            }
        }

        console.log('Search query:', query); // Debug log

        const students = await Student.find(query);

        console.log('Fetched students based on search criteria:', students); // Debug log

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
// Route to fetch student data based on seat number
// Route to fetch student data based on seat number
router.get('/seat/:seatNumber', async (req, res) => {
    try {
        const seatNumber = req.params.seatNumber;
        const students = await Student.find({ seatNumber });

        // Format the dateOfAdmission before sending the response
        const formattedStudents = students.map(student => ({
            ...student.toObject(),
            dateOfAdmission: student.dateOfAdmission ? student.dateOfAdmission.toISOString() : null, // Ensure ISO format
            dob: student.dob ? student.dob.toISOString() : null // Ensure ISO format
        }));

        res.json(formattedStudents);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});



module.exports = router;
