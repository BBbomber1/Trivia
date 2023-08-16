const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
    {
        question: {
            type: String,

        },
        answer: {
            type: String,
        }
    }
);

module.exports = mongoose.model('FinalProject', QuestionSchema);