const express = require('express');
const router = express.Router();
const Student = require('../Models/studentModel');
const ALLStudent = require('../Models/allstudents');

// Route to create a new student
router.post('/', async (req, res) => {
    try {
        const { rollNumber, name, gender, dob, aadharNo, contact, residentialNo, Fname, FOccupation, permanentAddress, postalAddress, academic, prepareFor, dateOfAdmission, slots, seatNumber } = req.body;

        // Check if rollNumber already exists
        const existingRollNumber = await Student.findOne({ rollNumber });
        if (existingRollNumber) {
            return res.status(400).json({ error: 'Roll number already exists' });
        }
        
        // Check if aadharNo already exists
        const existingAadhar = await Student.findOne({ aadharNo });
        if (existingAadhar) {
            return res.status(400).json({ error: 'Aadhar number already exists' });
        }

        // Check if seatNumber already exists
        const existingSeatNumber = await Student.findOne({ seatNumber });
        if (existingSeatNumber) {
            return res.status(400).json({ error: 'Seat number already exists' });
        }

        // Convert 'slots' from string to array if it's not already an array
        const slotsArray = Array.isArray(slots) ? slots : [slots];

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
            slots: slotsArray,
            seatNumber
        });
        const allStudent = new ALLStudent({
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
            slots: slotsArray,
            seatNumber
        });


        // Save the new student to the database
        await newStudent.save();
        await allStudent.save();

        res.status(201).json({ message: 'Student created successfully' });
    } catch (error) {
        console.error("Error:", error); // Log the error
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

        // Format the dateOfAdmission before sending the response
        const formattedDate = student.dateOfAdmission.toISOString().substr(0, 10);

        // Convert slots to an array if it's not already
        const formattedSlots = Array.isArray(student.slots) ? student.slots : [student.slots];

        // Create a new object with the formatted date and slots
        const formattedStudent = {
            ...student.toObject(), // Convert Mongoose document to plain JavaScript object
            dateOfAdmission: formattedDate,
            slots: formattedSlots
        };

        // Send the formatted student object as JSON response
        res.json(formattedStudent);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

// Route to update student data based on roll number
router.put('/:rollNumber', async (req, res) => {
    try {
        const rollNumber = req.params.rollNumber;
        const { name, gender, dob, aadharNo, contact, residentialNo, Fname, FOccupation, permanentAddress, postalAddress, academic, prepareFor, dateOfAdmission, slots, seatNumber } = req.body;

        // Find the student by roll number
        let student = await Student.findOne({ rollNumber });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Update student data
        student.name = name;
        student.gender = gender;
        student.dob = dob;
        student.aadharNo = aadharNo;
        student.contact = contact;
        student.residentialNo = residentialNo;
        student.Fname = Fname;
        student.FOccupation = FOccupation;
        student.permanentAddress = permanentAddress;
        student.postalAddress = postalAddress;
        student.academic = academic;
        student.prepareFor = prepareFor;
        student.dateOfAdmission = dateOfAdmission;
        student.slots = Array.isArray(slots) ? slots : [slots]; // Ensure slots is an array
        student.seatNumber = seatNumber;

        // Save the updated student
        await student.save();
        res.json({ message: 'Student updated successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

// Route to delete a student by roll number
router.delete('/:rollNumber', async (req, res) => {
    try {
        const rollNumber = req.params.rollNumber;
        
        // Find the student by roll number and delete it
        const deletedStudent = await Student.findOneAndDelete({ rollNumber });

        if (!deletedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Send a 204 No Content status code with an empty response body
        res.status(204).end();
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

// Route to get all students
router.get('/students', async (req, res) => {
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
