const mongoose = require("mongoose");
const Course = require('./Curso')

//esquema de usuario que se cargara como modelo en nuestra bd
const UsuarioSchema = new mongoose.Schema({
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true
    },
    password: { 
        type: String, 
        required: true
    },
    courses: [Course]
});

module.exports = mongoose.model('Usuario', UsuarioSchema)
