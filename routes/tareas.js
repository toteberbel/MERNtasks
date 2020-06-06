const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//Crear tarea api/tareas
router.post('/',
    auth,
    [
        check('nombre', "Nombre es obligatorio").not().isEmpty(),
        check('proyecto', "proyecto es obligatorio").not().isEmpty()
    ],
    tareaController.crearTarea
);

//Obtener las tareas por proyecto
router.get('/',
    auth,
    tareaController.obtenerTareas,
);

//Actualizar estado de las tareas
router.put('/:id',
    auth,
    tareaController.actualizarTarea
);

//Eliminar tarea
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
);

module.exports = router;