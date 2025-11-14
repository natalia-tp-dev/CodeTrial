const mongoose = require("mongoose");

//esquema de usuario que se cargara como modelo en nuestra bd
const UsuarioSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
});

module.exports = mongoose.model('Usuario', UsuarioSchema)
