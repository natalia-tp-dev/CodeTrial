
const validarRegistro = (req, res, next) => {
    const {firstName, lastName, email, password} = req.body
    //Validar campos 
    if(!email || !password || !firstName || !lastName){
        return res.status(400).json({
            error: 'All fields are required to sign in',
            status: 400
        })
    }
    //Validar formato de email
    const validar = email.split('@')
    if(!email.includes('@')){
        return res.status(400).json({
            error: 'Invalid format for email field, does not contain @',
            status: 400
        })
    }
    if(validar[1] !== 'gmail.com' && validar[1] !== 'hotmail.com'){
        return res.status(400).json({
            error: 'Invalid format for email field, does not contain gmail.com and neither hotmail.com',
            status: 400
        })
    }
    if(validar[0].trim() === ''){
        return res.status(400).json({
            error: 'Invalid format for email field, must contains something before @',
            status: 400
        })
    }
    //Validar longitud de contrasena
    if(password.length < 8){
        return res.status(400).json({
            error: 'The password must be at least 8 characters'
        })
    }
    //Pasamos al siguiente
    next()
}

module.exports = { validarRegistro }