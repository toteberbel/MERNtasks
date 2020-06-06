const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

// crear el servidor
const app = express();

//Conectar a la base de dato
conectarDB();

// Habilitar CORS ( PERMITIR QUE SE HAGN PETICIONES DESDE URLS EXTERNAS )
app.use(cors());

//Habilitar express.json (nos permite leer lo 1ue el usuario coloque)
app.use(express.json({ extended: true }));

// puerto de la app
const PORT = process.env.PORT || 4000;

//Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));


//arrancar la app
app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`)
});