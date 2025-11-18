require('dotenv').config()
const { exec } = require('child_process');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const Usuario = require('../model/Usuario')

//
const SECRET_KEY = process.env.SECRET_KEY

//Registro de usuario
const registrarUsuario = async (req,res) => {
    try {
        const {firstName, lastName, email, password} = req.body
        //Validar que no haya usuario registrado con el email
        const user = await Usuario.findOne({ email }) 
        if(user) return res.status(409).json({
            error: `The email ${email} is already registered`,
            status: 409
        })
        //Encriptar contrasena
        const hashed = await bcrypt.hash(password,10)
        //Agregar curso por defecto
        const defaultCourse = {
            courseName: 'Python',
            lessons: [
                {
                    lessonNumber: 1,
                    expectedOutPut: 'Hello World'
                },
                {
                    lessonNumber: 2,
                    expectedOutPut: '4'
                },
                {
                    lessonNumber: 3,
                    expectedOutPut: 'True'
                }
            ]
        }
        //Crear nuevo usuario
        const newUsuario = new Usuario({
            firstName, 
            lastName, 
            email, 
            password:hashed,
            courses: [defaultCourse]
        })
        //Guardar en mongodb
        await newUsuario.save()
        res.json({
            message: 'User succesfully registered',
            status: 201
        })
    } catch (error) {
        console.error('error al registrar usuario ',error)
        res.status(500).json({
            error: 'An error occurred',
            status: 500
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
            error: 'User not found',
            status: 404
        })
        const valido = await bcrypt.compare(password, usuario.password)
        if(!valido) return res.status(401).json({
            error: 'Password mistaken'
        })
        //Configuracion del token para autenticacion, el token nos retornara la info que le pasemos y expirara en 1h
        const token = jwt.sign({
            id: usuario._id,
            firstName: usuario.firstName,
            lastName: usuario.lastName,
            email: usuario.email,
            courses: usuario.courses
        }, 
            SECRET_KEY, 
            { expiresIn: '2h'}
        )
        //Enviar token en una cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 3600000
        })
        //Devolver respuesta exitosa
        res.json({
            message: 'Succesfully logged on',
            status: 201
        })
    } catch (err) {
        res.status(500).json({
            error: 'An error occurred while trying to log in',
            status: 500
        })
    }
}

//Obtener el perfil del usuario
const obtenerPerfil =  async (req,res) => {
    try{
        //Capturar informacion desde el middleware
        const {id, firstName, lastName, email, courses } = req.user
        const user = await Usuario.findOne({ email })
        //Validar que el usuario exista
        if(!user) return res.status(404).json({
            error: 'User not found'
        })
        //Respuesta
        res.json({
            message: `Welcome ${firstName} ${lastName}`,
            isLogged: true,
            user: {
                id,
                firstName,
                lastName,
                email,
                courses
            },
            status: 201
        })
    } catch (err) {
        res.status(500).json({
            error: 'An error ocurred while trying to get the profile',
            status: 500
        })
    }
    
}

//log-out
const logOut = (req, res) => {
    try {
        //Eliminar cookie del token
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        })
        //Respuesta
        res.json({
            message: 'Logged out succesfully',
            status: 201,
            isLogged: false
        })
    } catch (err) {
        res.status(500).json({
            error: 'Error logging out'
        })
    }
}

//Ejecutar
const ejecutar = async(req, res) => {
    try {
        //Constantes
        const { courses } = req.user
        const { code, lessonNumber } = req.body;

        //Buscar leccion
        const Lesson = courses[0].lessons.find(l => l.lessonNumber === lessonNumber) 
        if(!Lesson){
            return res.status(404).json({
                error: 'Lesson not found',
                status: 404
            })
        }
        const expectedOutPut = Lesson.expectedOutPut
        const filePath = `temp_${Date.now()}.py`;
        fs.writeFileSync(filePath, code);
        //ejecutar codigo python con el comando tipico
        exec(`python ${filePath}`, (error, stdout, stderr) => {
            fs.unlinkSync(filePath);
            //retornar error
            if (error)
            return res.status(500).json({
                success: false,
                output: stderr || error.message,
                isCompleted: false,
            });
            const output = stdout.trim()
            //Validar salida con la esperada
            if (output === expectedOutPut) {
                Lesson.isCompleted = true
            } else {
                Lesson.isCompleted = false
            }
            console.log(Lesson.isCompleted)
            res.json({
                isCompleted: Lesson.isCompleted,
                output
            })
        });
    } catch (error) {
        res.status(500).json({
            error: 'Execution error',
            status: 500
        })
    }
};

//Actualizar Codigo de usuario
const actualizarCodigo = async (req, res) => {
    try {
        //Constantes requeridas
        const { email } = req.user
        const { lessonNumber, code } = req.body
        //Encontrar al usuario por email
        const User = await Usuario.findOne({ email })
        if(!User){
            return res.status(404).json({
                error: 'User not found',
                status: 404
            })
        }
        console.log(User)
        //Encontrar el curso por el nombre
        const Course = User.courses.find(c => c.courseName === 'Python')
        if(!Course){
            return res.status(404).json({
                error: 'Course not found',
                status: 404
            })
        }
        //Encontrar leccion por el numero y guardar el codigo
        const Lesson = Course.lessons.find(l => l.lessonNumber === lessonNumber) 
        if(!Lesson){
            return res.status(404).json({
                error: 'Lesson not found',
                status: 404
            })
        }
        //Guardar el codigo del usuario
        Lesson.code = code
        await User.save()
        res.json({
            message: 'Your code was succesfully saved',
            status: 201
        })
    } catch (error) {
        res.status(500).json({
            error: 'An error ocurred while trying to save the code',
            status: 500
        })
    }
}

//Obtener codigo
const obtenerCodigoEstado = async (req, res) => {
    const { email } = req.user
    const lessonNumber  = req.query.lessonNumber
    console.log(lessonNumber);
    const User = await Usuario.findOne({ email })
    if(!User){
        return res.status(404).json({
            error: 'User not found',
            status: 404
        })
    }
    //Encontrar el curso por el nombre
    const Course = User.courses.find(c => c.courseName === 'Python')
    if(!Course){
        return res.status(404).json({
            error: 'Course not found',
            status: 404
        })
    }
    //Encontrar leccion por el numero y guardar el codigo
    const Lesson = Course.lessons.find(l => l.lessonNumber == lessonNumber) 
    if(!Lesson){
        return res.status(404).json({
            error: 'Lesson not found',
            status: 404
        })
    }
    const code = Lesson.code
    const isCompleted = Lesson.isCompleted
    res.json({
        code,
        isCompleted,
        status: 201
    })
}

//actualizar estado leccion
const actualizarEstado = async(req, res) => {
    const { email } = req.user
    const { state , lessonNumber}  = req.body
    console.log(lessonNumber);
    const User = await Usuario.findOne({ email })
    if(!User){
        return res.status(404).json({
            error: 'User not found',
            status: 404
        })
    }
    //Encontrar el curso por el nombre
    const Course = User.courses.find(c => c.courseName === 'Python')
    if(!Course){
        return res.status(404).json({
            error: 'Course not found',
            status: 404
        })
    }
    //Encontrar leccion por el numero y guardar el codigo
    const Lesson = Course.lessons.find(l => l.lessonNumber == lessonNumber) 
    if(!Lesson){
        return res.status(404).json({
            error: 'Lesson not found',
            status: 404
        })
    }

    Lesson.isCompleted = state
    await User.save();
    res.json({
        message: 'State succesfully changed',
        status: 201
    })
}
//Eliminar usuarios de prueba
const eliminarUsuarios = async () => {
    try {
        await Usuario.deleteMany({ })
        console.log('Usuarios eliminados correctamente');
    } catch (err) {
        console.log(err);
    }
}

module.exports = { registrarUsuario, iniciarUsuario, obtenerPerfil, logOut, actualizarCodigo, eliminarUsuarios, ejecutar, obtenerCodigoEstado, actualizarEstado }