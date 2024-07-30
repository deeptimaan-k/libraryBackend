const express = require('express');
const router = express.Router();
const Fee = require('../Models/feeDetailModel'); // Import the Fee model
const Student = require('../Models/studentModel'); // Import the Student model
// Route to submit fee details
router.post('/:studentId', async (req, res) => {
    const { studentId } = req.params;
    const { currentDate, endDate, dueDate, month, amount } = req.body;

    try {
        // Check if the student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Find or create a Fee document for the student
        let feeDoc = await Fee.findOne({ student: studentId });

        if (!feeDoc) {
            feeDoc = new Fee({
                student: studentId,
                fees_record: {}
            });
        }

        // Convert currentDate to YYYY-MM-DD format
        const dateKey = new Date(currentDate).toISOString().split('T')[0]; // Use YYYY-MM-DD format

        // Update the fees_record object
        feeDoc.fees_record.set(dateKey, { endDate, dueDate, month, amount });

        // Save the document
        await feeDoc.save();

        // Respond with success message and the updated fee document
        res.status(201).json({ message: 'Fee details added/updated successfully', fee: feeDoc });
    } catch (error) {
        console.error('Error submitting fee details:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to fetch fee details
router.get('/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const fee = await Fee.findOne({ student: studentId }).populate('student');
        
        if (!fee) {
            return res.status(404).json(0);
        }

        res.status(200).json(fee);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'An error occurred while fetching fee records.' });
    }
});




module.exports = router;
