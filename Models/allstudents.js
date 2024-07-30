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
        required: true,
    },
    residentialNo: {
        type: String,
        required: true,
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
});

const ALLStudent = mongoose.model('ALLStudent', studentSchema);

module.exports = ALLStudent;
