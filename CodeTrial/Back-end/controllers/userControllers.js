require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Usuario = require('../model/Usuario')

//
const SECRET_KEY = process.env.SECRET_KEY

//Registro de usuario
const registrarUsuario = async (req,res) => {
    try {
        const {firstName, lastName, email, password} = req.body

        //Validar que la info no sea vacia
        if (!firstName || !lastName || !email || !password){
            return res.status(400).json({
                error: 'Todos los campos son obligatorios'
            })
        }

        const user = await Usuario.findOne({ email })

        if(user) return res.status(409).json({
            error: `El usuario con email ${user.email} ya existe` 
        })
        //Encriptar contrasena
        const hashed = await bcrypt.hash(password,6)
        //Crear nuevo usuario
        const newUsuario = new Usuario({
            firstName, 
            lastName, 
            email, 
            password:hashed
        })
        //Guardar en mongodb
        await newUsuario.save()
        res.json({
            mensaje: 'Usuario registrado correctamente'
        })
    } catch (error) {
        console.error('error al registrar usuario ',error)
        res.status(500).json({
            error: 'Eror al registrar usuario'
        })
    }
}


//Log in de usuario
const iniciarUsuario = async (req, res) => {
    try {
        //Recibir contrasena y correo y buscar por el email
        const {email, password} = req.body
        const usuario = await Usuario.findOne({ email })

        //Validar que el usuario exista
        if(!usuario) return res.status(404).json({
            error: 'Usuario no encontrado'
        })

        const valido = await bcrypt.compare(password, usuario.password)
        if(!valido) return res.status(401).json({
            error: 'Contrasena incorrecta'
        })

        //Configuracion del token para autenticacion, el token nos retornara la info que le pasemos y expirara en 1h
        const token = jwt.sign({
            id: usuario._id,
            firstName: usuario.firstName,
            lastName: usuario.lastName,
            email: usuario.email
        }, 
        SECRET_KEY, 
        { expiresIn: '1h'}
        )

        //Enviar token en una cookie
        res.cookie('token',token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 3600000
        })

        //Devolver respuesta exitosa
        res.json({
            mensaje: 'Inicio de sesion exitoso ', token
        })
    } catch (err) {
        res.status(500).json({
            error: 'Error en el inicio de sesion '
        })
    }
}

//Obtener el perfil del usuario
const obtenerPerfil =  async (req,res) => {
    try{
        //Capturar informacion
        const { firstName, lastName, email } = req.body 
        const user = await Usuario.findOne({ email })

        //Validar que el usuario exista
        if(!user) return res.code(404).json({
            error: 'Usuario no encontrado'
        })

        //Respuesta valida
        res.json({
            message: `Bienvenid@ ${firstName} ${lastName}`
        })
    } catch (err) {
        res.status(500).json({
            error: 'Error al buscar al usuario'
        })
    }
    
}

module.exports = { registrarUsuario, iniciarUsuario, obtenerPerfil }