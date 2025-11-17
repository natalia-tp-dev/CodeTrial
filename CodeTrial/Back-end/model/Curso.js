const mongoose = require('mongoose')
const Lesson = require('./Leccion')

const CourseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true
    },
    lessons: [Lesson] 
}, {_id: false})

module.exports = CourseSchema