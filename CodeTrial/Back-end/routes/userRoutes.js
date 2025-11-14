const express = require('express')
const router = express.Router()

const { registrarUsuario, iniciarUsuario, obtenerPerfil } = require('../controllers/userControllers')
const { auth } = require('../middlewares/authMiddleware') 

router.post('/sign-in', registrarUsuario)
router.post('/log-in', iniciarUsuario)
router.get('/get-profile', auth, obtenerPerfil)

module.exports = router