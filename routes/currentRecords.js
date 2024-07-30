const express = require('express');
const router = express.Router();
const Student = require('../Models/studentModel');

// Route to fetch all student data
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
// Route to fetch student data based on search criteria
router.post('/search', async (req, res) => {
    try {
        const searchCriteria = req.body;
        const query = {};

        // Ensure that searchCriteria is not empty
        if (Object.keys(searchCriteria).length === 0) {
            return res.status(400).json({ error: 'No search criteria provided' });
        }

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
            dateOfAdmission: student.dateOfAdmission ? student.dateOfAdmission.toISOString().substr(0, 10) : null
        }));

        res.json(formattedStudents);
    } catch (error) {
        console.error("Error searching for students:", error);
        res.status(500).json({ error: 'An error occurred while searching for students' });
    }
});


// Route to fetch student data based on seat number
router.get('/seat/:seatNumber', async (req, res) => {
    try {
        const seatNumber = req.params.seatNumber;

        // Build the query to search within seats Map
        const students = await Student.find({
            'seats': {
                $elemMatch: {
                    seat: seatNumber
                }
            }
        });

        console.log('Fetched students based on seat number:', students); // Debug log

        // Format the dateOfAdmission and dob before sending the response
        const formattedStudents = students.map(student => ({
            ...student.toObject(),
            dateOfAdmission: student.dateOfAdmission ? student.dateOfAdmission.toISOString().substr(0, 10) : null,
            dob: student.dob ? student.dob.toISOString().substr(0, 10) : null // Ensure date format
        }));

        res.json(formattedStudents);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

module.exports = router;
