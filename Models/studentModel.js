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
    mobileNumber: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // Regular expression to validate mobile numbers (10 digits)
                return /^[0-9]{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid mobile number!`
        }
    },
    dateOfAdmission: {
        type: Date,
        required: true
    },
    slots: [{
        type: String,
        enum: ['slot1', 'slot2', 'slot3'],
        required: true
    }],
    seatNumber: {
        type: String,
        unique: true // Ensures seatNumber is unique
    }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
