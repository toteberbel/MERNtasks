const Proyecto = require('../models/Proyecto');
const {
    validationResult
} = require('express-validator');

exports.crearProyecto = async (req, res) => {

    //Revisar si hay errores al llenar el form de proyecto
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array()
        });
    }

    try {
        //Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        //Guardar el creador vía json web token
        proyecto.creador = req.usuario.id;

        //Guardamos el proyecto
        proyecto.save();
        res.json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error")
    }
}

//obtiene todos los proyecos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({
            creador: req.usuario.id
        }).sort({
            creado: -1
        });
        res.json({
            proyectos
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error");
    }
}

// Actualizar un proyecto
exports.actualizarProyecto = async (req, res) => {

    //Revisar si hay errores al llenar el form de proyecto
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array()
        });
    }

    //Extraer la informacion del proyecto
    const {
        nombre
    } = req.body;
    const nuevoProyecto = {};

    if (nombre) {
        nuevoProyecto.nombre = nombre;
    } // Si quiero agregar nuevos campos al proyecto debería armar un nuevo if por cada nuevo campo

    try {
        //Revisar el id
        let proyecto = await Proyecto.findById(req.params.id);

        //Revisar que exista ese proyecto
        if (!proyecto) {
            return res.status(404).json({
                msg: " proyecto no encontrado"
            })
        }

        //Verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: "No autorizado"
            });
        }

        //Actualizar
        proyecto = await Proyecto.findByIdAndUpdate({
            _id: req.params.id
        }, {
            $set: nuevoProyecto
        }, {
            new: true
        });
        res.json({
            proyecto
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Error en el servidor")
    }
}

//Eliminar un proyecto
exports.eliminarProyecto = async (req, res) => {
    try {
        //Revisar el id
        let proyecto = await Proyecto.findById(req.params.id);

        //Revisar que exista ese proyecto
        if (!proyecto) {
            return res.status(404).json({
                msg: " proyecto no encontrado"
            })
        }

        //Verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: "No autorizado"
            });
        }

        //Eliminar el proyecto
        await Proyecto.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: "Proyecto eliminado" });

    } catch (error) {
        console.log(Error);
        res.status(500).send("error en el servidor")
    }
}