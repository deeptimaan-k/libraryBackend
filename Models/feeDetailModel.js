const mongoose = require('mongoose');

const FeeRecordSchema = new mongoose.Schema({
    endDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    month:{type:Number, required:true},
    amount: { type: Number, required: true },
    
});

const FeeSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    fees_record: { type: Map, of: FeeRecordSchema } // Define as Map
});

module.exports = mongoose.model('Fee', FeeSchema);
