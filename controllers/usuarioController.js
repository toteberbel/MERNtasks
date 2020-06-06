const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {
    validationResult
} = require("express-validator");

const jwt = require('jsonwebtoken');

//El request sería lo que nos envian a la api es decir la info del usuario
exports.crearUsuario = async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array()
        });
    }

    //Verificar que un usuario no exista ya
    const {
        email,
        password
    } = req.body;

    try {
        //Verificar que el usuario sea unico
        let usuario = await Usuario.findOne({
            email
        });

        if (usuario) {
            return res.status(400).json({
                msg: 'El usuario ya existe'
            });
        }

        //crea el nuevo usuario
        usuario = new Usuario(req.body);

        //Hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        //guarda el nuevo usuario
        await usuario.save();

        //Crear y firmar el JSON WEB TOKEN
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //Firmar el token
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 360000,
        }, (error, token) => {
            if (error) throw error;

            //Mensaje de confirmacion
            res.json({
                token
            });
        });

    } catch (error) {
        console.log(error);
        res.status(400).send('Hay un error');
    }
}