const mongoose = require('mongoose');

// Define the schema for the fee records
const feeSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    year: {
        type: Number,
        required: true,
        min: [2000, 'Year cannot be before 2000'], // You can adjust this as needed
        max: [2100, 'Year cannot be after 2100'] // You can adjust this as needed
    },
    month: {
        type: String,
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: [0, 'Fee amount cannot be negative']
    },
    dateOfPayment: {
        type: Date,
        required: true,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'online'],
        required: true
    },
    receiptNumber: {
        type: String,
        unique: true
    }
}, {
    timestamps: true
});

// Index to ensure unique combinations of student, year, and month
feeSchema.index({ student: 12, year: 1, month: 1 }, { unique: true });

const Fee = mongoose.model('Fee', feeSchema);

module.exports = Fee;
