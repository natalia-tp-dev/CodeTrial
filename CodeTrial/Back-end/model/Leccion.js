const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
    lessonNumber: {
        type: Number,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    code: {
        type: String,
        default: "",
    },
    expectedOutPut: {
        type: String,
        default: ""
    },
    userOutput: {
        type: String,
        default: ''
    }
}, {_id: false});

module.exports = LessonSchema
