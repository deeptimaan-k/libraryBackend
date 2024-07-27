const express = require('express');
const router = express.Router();
const Fee = require('../Models/feeDetailModel');
const Student = require('../Models/studentModel');

// Route to submit fee details
router.post('/:studentId', async (req, res) => {
    const studentId = req.params.studentId;
    const { year, month, amount, paymentMethod, receiptNumber } = req.body;

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const newFee = new Fee({
            student: studentId,
            year,
            month,
            amount,
            paymentMethod,
            receiptNumber
        });

        await newFee.save();
        return res.status(201).json({ message: 'New fee details created successfully', fee: newFee });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Route to update fee details
router.put('/:studentId/:feeId', async (req, res) => {
    const studentId = req.params.studentId;
    const feeId = req.params.feeId;
    const { year, month, amount, paymentMethod, receiptNumber } = req.body;

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const updatedFee = await Fee.findByIdAndUpdate(
            feeId,
            { year, month, amount, paymentMethod, receiptNumber },
            { new: true }
        );

        if (!updatedFee) {
            return res.status(404).json({ error: 'Fee record not found' });
        }

        return res.status(200).json({ message: 'Fee details updated successfully', fee: updatedFee });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Route to fetch fee details for a student
router.get('/:studentId', async (req, res) => {
    const studentId = req.params.studentId;

    try {
        const fees = await Fee.find({ student: studentId }).sort({ year: -1, month: 1 });
        return res.status(200).json(fees);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});
router.get('/upcoming/:studentId', async (req, res) => {
    const studentId = req.params.studentId;
    const currentYear = new Date().getFullYear();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonthIndex = new Date().getMonth(); // Months are 0-indexed
  
    try {
      const upcomingFees = await Fee.find({
        student: studentId,
        $or: [
          { year: { $gt: currentYear } }, // Future years
          { year: currentYear, month: { $in: monthNames.slice(currentMonthIndex) } } // Current year and future months
        ]
      }).sort({ year: 1, month: 1 });
  
      return res.status(200).json(upcomingFees);
  
    } catch (error) {
      console.error('Error fetching upcoming fees:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  });
  
  
module.exports = router;
