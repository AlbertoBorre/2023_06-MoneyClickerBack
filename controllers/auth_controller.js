const { response } = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

//Creacion de usuario al registrarse:
const crearUsuario = async (req, res = response) => {
    const { email, name, password, coins, coinsPorSegundo, precios } = req.body; //Sabemos que la creación va a tener estos campos solamente
    //console.log(email, name, password, coins);

    try {
        //verificamos el email
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'El mail ya existe en otro usuario...'
            })
        }

        //creamos usuario con el modelo
        const dbuser = new User(req.body);

        //Hasheo contraseña
        const randomNumber = bcrypt.genSaltSync(); //Da 10 vueltas por defecto
        dbuser.password = bcrypt.hashSync(password, randomNumber);

        //Generar el JWT
        const token = await generarJWT(dbuser.id, dbuser.name);

        //Crear usuario en la DB
        await dbuser.save();

        //Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbuser.id,
            name,
            coins,
            coinsPorSegundo,
            precios,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error, consulte a su administrador'
        })
    }
}

//Login del usuario:
const loginUsuario = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        const dbUser = await User.findOne({ email });
        //Confirmamos Correo
        if (!dbUser) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            })
        }

        //Confirmamos contraseña
        const validPassword = bcrypt.compareSync(password, dbUser.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña es incorrecta'
            })
        }

        //Generar el JWT
        const token = await generarJWT(dbUser.id, dbUser.name);

        //Respuesta del servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            coins: dbUser.coins,
            coinsPorSegundo: dbUser.coinsPorSegundo,
            precios: dbUser.precios,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Habla con el admin, error...'
        })
    }
}

//Actualizacion de las monedas:
const updateCoins = async (req, res = response) => {
    const { coins } = req.body;
    const { coinsPorSegundo } = req.body;
    const { uid } = req;

    //Leer la base de datos
    const dbUser = await User.findOne({//Espero a que la promesa se ejecute
        uid
    });

    const update = {
        "coins": coins,
        "coinsPorSegundo": coinsPorSegundo
    };
    await User.findOneAndUpdate(uid, update);

    return res.json({
        ok: true,
        uid,
        name: dbUser.name,
        email: dbUser.email,
        coins: update.coins,
        coinsPorSegundo: update.coinsPorSegundo
    })
}

//Actualizacion de los precios:
const updatePrecios = async (req, res = response) => {
    const { precios } = req.body;
    const { uid } = req;

    //Leer la base de datos
    const dbUser = await User.findOne({
        uid
    });

    const update = {
        "precios": precios
    };
    await User.findOneAndUpdate(uid, update);

    return res.json({
        ok: true,
        uid,
        name: dbUser.name,
        email: dbUser.email,
        coins: update.precios
    })
}

//Get de los 5 usuarios con mas monedas:
const getRanking = async (res = response) => {
    try {
        const users = await User.find({}, "name coins").sort({ coins: -1 }).limit(10);//coins descendentes hasta 10 users

        return res.json({
            ok: true,
            ranking: users
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error al obtener el ranking de usuarios"
        });
    }
};

//Exporto los metodos:
module.exports = {
    crearUsuario,
    loginUsuario,
    updateCoins,
    updatePrecios,
    getRanking
}
