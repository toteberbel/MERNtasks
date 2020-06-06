// rutas para crear usuarios

const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { check } = require('express-validator');

// Crea un usuario
// endpoint => api/usuarios
router.post('/',
    [
        check('nombre', "El nombre es obligatorio").not().isEmpty(),
        check("email", "Agrega un email válido").isEmail(),
        check("password", "El password debe ser minimo de 6 caracteres").isLength({min: 6})
    ],
    usuarioController.crearUsuario
); // Aca le estamos diciendo que cuando hagamos un post a la direccion / (es decir a api/usuarios) se ejecute ese codigo

module.exports = router;