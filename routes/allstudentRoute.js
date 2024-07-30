const express = require('express');
const router = express.Router();
const ALLStudent = require('../Models/allstudents');

// Route to fetch all student data
router.get('/', async (req, res) => {
    try {
        const students = await ALLStudent.find();

        console.log('Fetched all students:', students); // Debug log

        // Format the dateOfAdmission before sending the response
        const formattedStudents = students.map(student => ({
            ...student.toObject(),
            dateOfAdmission: student.dateOfAdmission ? student.dateOfAdmission.toISOString().substr(0, 10) : null
        }));

        res.json(formattedStudents);
    } catch (error) {
        console.error("Error fetching all students:", error);
        res.status(500).json({ error: 'An error occurred while fetching all students' });
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

        const students = await ALLStudent.find(query);

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

module.exports = router;
