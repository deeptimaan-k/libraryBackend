const express = require('express');
const router = express.Router();
const Student = require('../Models/studentModel');
const ALLStudent = require('../Models/allstudents'); // Assuming this is a separate collection for all students
const Fees = require('../Models/feeDetailModel'); // Assuming this is a separate collection for all students

// Route to create a new student
router.post('/', async (req, res) => {
    try {
        const { rollNumber, name, gender, dob, aadharNo, contact, residentialNo, Fname, FOccupation, permanentAddress, postalAddress, academic, prepareFor, dateOfAdmission, seats } = req.body;

        // Check if rollNumber or aadharNo already exists
        const existingRollNumber = await Student.findOne({ rollNumber });
        if (existingRollNumber) {
            return res.status(400).json({ error: 'Roll number already exists' });
        }
        const existingAadhar = await Student.findOne({ aadharNo });
        if (existingAadhar) {
            return res.status(400).json({ error: 'Aadhar number already exists' });
        }

        // Create a new student object
        const newStudent = new Student({
            rollNumber,
            name,
            gender,
            dob,
            aadharNo,
            contact,
            residentialNo,
            Fname,
            FOccupation,
            permanentAddress,
            postalAddress,
            academic,
            prepareFor,
            dateOfAdmission,
            seats: new Map(Object.entries(seats)),
            isActive:true, // Convert seats to Map format
        });

        // Save the new student to the database
        await newStudent.save();

        res.status(201).json({ message: 'Student created successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

// Route to get a student by roll number
router.get('/:rollNumber', async (req, res) => {
    try {
        const rollNumber = req.params.rollNumber;

        // Find the student by roll number
        const student = await Student.findOne({ rollNumber });

        // If student not found, return 404 error
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Convert seats Map to an array of slot values
        const formattedStudent = {
            ...student.toObject(),
            dateOfAdmission: student.dateOfAdmission.toISOString().substr(0, 10),
            slots: Array.from(student.seats.entries()).map(([seat, slot]) => ({ seat, slot })) // Convert Map to Array
        };

        res.json(formattedStudent);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});


// Route to update student data based on roll number
// Route to partially update student data based on roll number
router.patch('/:rollNumber', async (req, res) => {
    try {
        const rollNumber = req.params.rollNumber;
        const updateFields = req.body;

        // Find the student by roll number
        const student = await Student.findOne({ rollNumber });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Update student data with only provided fields
        Object.keys(updateFields).forEach(field => {
            student[field] = updateFields[field];
        });

        // Save the updated student
        await student.save();
        res.json({ message: 'Student updated successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});


// Route to update seat booking for a student by roll number
router.put('/seatbooking/:rollNumber', async (req, res) => {
    try {
        const rollNumber = req.params.rollNumber;
        const { seats } = req.body;

        // Find the student by roll number
        const student = await Student.findOne({ rollNumber });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Update seats data
        student.seats = seats; // Assign array directly

        // Save the updated student
        await student.save();
        res.json({ message: 'Student seat booking updated successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});


// Route to delete a student by roll number
router.patch('/:rollNumber/deactivate', async (req, res) => {
    const { rollNumber } = req.params;
    const { isActive, seats } = req.body;

    if (isActive !== false) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        const student = await Student.findOneAndUpdate(
            { rollNumber: rollNumber },
            { 
                isActive: false,
                seats: seats || [] // Update seats to an empty array if not provided
            },
            { new: true } // Return the updated document
        );

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({ message: 'Student record deactivated and seats cleared successfully', student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.patch('/:rollNumber/activate', async (req, res) => {
    const { rollNumber } = req.params;
    const { isActive, seats } = req.body;

    if (isActive !== true) {
        return res.status(400).json({ error: 'Invalid request' });
    }

    try {
        const student = await Student.findOneAndUpdate(
            { rollNumber: rollNumber },
            { 
                isActive: true,
                seats: seats || [] // Update seats field if provided
            },
            { new: true } // Return the updated document
        );

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({ message: 'Student record activated successfully', student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});



// Route to get all students
router.get('/students', async (req, res) => {
    try {
        const students = await Student.find();

        // Format the dateOfAdmission and convert Map to Object for each student
        const formattedStudents = students.map(student => ({
            ...student.toObject(),
            dateOfAdmission: student.dateOfAdmission.toISOString().substr(0, 10),
            seats: Object.fromEntries(student.seats) // Convert Map to Object for response
        }));

        res.json(formattedStudents);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

module.exports = router;
