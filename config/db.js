const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, { // Mongoose nos va a concetar con nuestra base de datos. Para ello
            useNewUrlParser: true,                      // necesita como primer parametro un URL (MONGO_DB) y como segundo
            useUnifiedTopology: true,                   // un objeto de cofiguracion
            useFindAndModify: false,
        });
        console.log("DB CONECTADA");
    } catch (error) {
        console.log(error);
        process.exit(1); //Detener la app en caso de un error
    }
}

module.exports = conectarDB;