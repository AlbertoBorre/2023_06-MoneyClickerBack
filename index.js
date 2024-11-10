const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

require('dotenv').config();

//Creamos server
const app = express();

//Conexión a la BD
dbConnection

//Middlewares
app.use(cors({//Seguridad cors
    origin: '*'
}));
app.use(express.json()); //lectura y parseo del body formato json
app.use('/api/auth', require('./routes/auth_routes'));

app.listen(process.env.PORT, () => {//escucha del puerto del .env
    console.log(`Servidor ejecutandose en el puerto: ${process.env.PORT}`);
})
