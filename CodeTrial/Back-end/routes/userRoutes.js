const express = require('express')
const router = express.Router()
const { registrarUsuario, iniciarUsuario, obtenerPerfil, logOut, ejecutar, actualizarCodigo, eliminarUsuarios, obtenerCodigo, actualizarEstado } = require('../controllers/userControllers')
const { auth } = require('../middlewares/authMiddleware') 
const { validarLogin } = require('../middlewares/validarLogInMiddleware')
const { validarRegistro } = require('../middlewares/validarRegistroMiddleware')
const { validarCamposActualizar } = require('../middlewares/validarActualizarCodigoMiddleware')

//definicion de rutas y sus metodos
router.post('/sign-in', validarRegistro, registrarUsuario)
router.post('/log-in', validarLogin, iniciarUsuario)
router.post('/log-out', logOut)
router.get('/get-profile-info', auth, obtenerPerfil)
router.post('/execute-code', auth, validarCamposActualizar, ejecutar)
router.put('/update', auth, validarCamposActualizar,  actualizarCodigo)
router.get('/get-code', auth, obtenerCodigo)
router.delete('/del-users', eliminarUsuarios)
router.put('/update-state', auth, actualizarEstado)

module.exports = router