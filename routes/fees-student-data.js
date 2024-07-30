const express = require('express');
const router = express.Router();
const Fee = require('../Models/feeDetailModel'); // Import the Fee model
const Student = require('../Models/studentModel'); 



router.get('/', async (req, res) => {
    try {
        // Step 1: Fetch all students
        const students = await Student.find().exec();
        if (!students || students.length === 0) {
            return res.status(404).json({ message: 'No students found' });
        }

        // Step 2: Extract student IDs
        const studentIds = students.map(student => student._id);

        // Step 3: Fetch all fee records for the extracted student IDs
        const fees = await Fee.find({ student: { $in: studentIds } }).exec();

        // Step 4: Create a map of fee records by student ID
        const feeMap = fees.reduce((map, fee) => {
            map[fee.student.toString()] = fee.fees_record;
            return map;
        }, {});

        // Combine student details with their fee records
        const studentFees = students.map(student => ({
            student: student.toObject(),
            fees_record: feeMap[student._id.toString()] || {}
        }));

        // Respond with the combined data
        res.status(200).json(studentFees);
    } catch (error) {
        console.error('Error fetching student details and fee records:', error);
        res.status(500).json({ message: 'An error occurred while fetching student details and fee records.', error: error.message });
    }
});


module.exports = router;