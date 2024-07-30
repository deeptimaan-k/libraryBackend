const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const studentRoutes = require('./routes/studentRoutes');
const allStudents = require('./routes/allstudentRoute');
const loginRoutes = require('./routes/loginRoutes');
const currentRecordsRoutes = require('./routes/currentRecords');
const feeDetailRoutes = require('./routes/feeDetailRoutes'); // Add this line
const feedataRoutes = require('./routes/fees-student-data'); // Add this line

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Database connection
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Terminate the application if unable to connect to the database
    });

// Routes
app.use('/students', studentRoutes);
app.use('/allStudents', allStudents);
app.use('/login', loginRoutes);
app.use('/currentRecords', currentRecordsRoutes);
app.use('/fees', feeDetailRoutes); // Add this line
app.use('/fees-student-data', feedataRoutes); // Add this line

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
