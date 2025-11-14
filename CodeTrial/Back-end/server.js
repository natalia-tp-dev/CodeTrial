//Dependencias necesarias
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const userRoutes = require('./routes/userRoutes')


//defincion de variables
const MAIN_ROUTE = process.env.MAIN_ROUTE
const app = express()
app.use(cors({
    origin: MAIN_ROUTE,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

//Conexion a la bd de MongoDB
mongoose.connect(process.env.MONGO_DB)
.then(() => console.log('Conexión exitosa con MongoDB Atlas'))
.catch(err => console.error('Error al realizar la conexión:', err));

//Ruta principal para las rutas de usuario
app.use('/api/usuarios', userRoutes)

//Constante que almacenara el valor de la variable de entorno PORT
const PORT = process.env.PORT

//Encender el servidor en el
app.listen(PORT, () => {
    console.log('Servidor corriendo en http://localhost:'+PORT);
})