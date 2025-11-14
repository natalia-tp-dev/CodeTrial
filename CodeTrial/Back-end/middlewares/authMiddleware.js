const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY

//autenticacion para el usuario con el token que fue enviado en una cookie
const auth = (req, res, next) => {
    try {
        //Capturar y validar el token
        const token = req.cookies.token
        console.log(token);
        if(!token) return res.status(401).json({
            error: 'No estas autenticado'
        })
        //Confirmar que el token haya sido firmado con la key secreta
        const decoded = jwt.verify(token, SECRET_KEY)
        //Le asignamos el contenido del token a req.user
        req.user = decoded
        //Saltamos al controlador
        next()
    } catch (err) {
        console.error(err)
        res.status(403).json({
            error: 'Token invalido o expirado'
        })
    }
}

module.exports = { auth }