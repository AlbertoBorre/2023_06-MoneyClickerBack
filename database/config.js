const mongoose = require('mongoose');

dbConnection().catch(err => console.log(err));

//Conexion a mi DDBB:
async function dbConnection(){
    /* SE HA ELIMINADO LA CONEXIÓN A LA BASE DE DATOS PARA QUE NO ESTE PÚBLICA */
}
module.exports = {
    dbConnection
}
