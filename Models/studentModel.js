const mongoose = require('mongoose');

// Define the schema for the student registration
const studentSchema = new mongoose.Schema({
    rollNumber: {
        type: String,
        required: true,
        unique: true // Ensures rollNumber is unique
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    aadharNo: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        required: true
    },
    residentialNo: {
        type: String,
        required: true
    },
    Fname: {
        type: String,
        required: true
    },
    FOccupation: {
        type: String,
        required: true
    },
    permanentAddress: {
        type: String,
        required: true
    },
    postalAddress: {
        type: String,
        required: true
    },
    academic: {
        type: String,
        required: true
    },
    prepareFor: {
        type: String,
        required: true
    },
    dateOfAdmission: {
        type: Date,
        required: true
    },
    seats: [{
        seatNumber: {
            type: Number,
            _id: false // Disable _id for the seatNumber field
        },
        slot: {
            type: String,
            _id: false // Disable _id for the slot field
        }
    }],
    isActive: {
        type: Boolean,
        default: true // Default value for isActive field
    }
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
