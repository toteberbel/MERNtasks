const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
    // Revisar si hay errores
    const errores = validationResult(req);
    //Las reglas de verificacion estan en los chec de la ruta

    if (!errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array()
        });
    };

    const { email, password } = req.body;

    try {
        //Revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({ email });

        if (!usuario) { //Es decir si el usuario NO EXISTE mandá esto como response
            return res.status(400).json({ msg: "El usuario no existe" });
        }

        // Si el usuario existe, revisar el password
        const passCorrecto = await bcryptjs.compare(password, usuario.password); //Compara el password que le estamos pasando como request con el que tenemos almacenado
        if (!passCorrecto) {
            return res.status(400).json({msg: "Password incorrecto"})
        };

        // Si todo es correcto Crear y firmar el JSON WEB TOKEN
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //Firmar el token
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600,
        }, (error, token) => {
            if (error) throw error;

            //Mensaje de confirmacion
            res.json({
                token
            });
        });
    } catch (error) {
        console.log(error);
    }
}

// Obtener que usuario esta autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await (Usuario.findById(req.usuario.id)).select('-password');
        res.json({ usuario });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error" });
    }
}