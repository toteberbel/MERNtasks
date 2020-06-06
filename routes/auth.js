// ruta para autenticar usuario
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');


// Iniciar sesión
// endpoint => api/auth
router.post('/',

    authController.autenticarUsuario

); // Aca le estamos diciendo que cuando hagamos un post a la direccion / (es decir a api/usuarios) se ejecute ese codigo

// Obtener el usuario que esta autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado,
);
module.exports = router;