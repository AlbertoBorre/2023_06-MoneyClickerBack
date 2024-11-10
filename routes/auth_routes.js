const { Router } = require('express');
//exporto de la ruta controllers/authcontroller los siguientes metodos:
const { crearUsuario, loginUsuario, updateCoins, updatePrecios, getRanking } = require('../controllers/auth_controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//Crear nuevo usuario
router.post('/new',[//con endpoint /new
    check('name', 'El nombre es un campo obligatorio!').not().isEmpty(),
    check('email', 'El email es un campo obligatorio!').isEmail(),
    check('password', 'La contraseña es obligatoria!').isLength({min: 5}),
    check('coins', 'coins es un campo obligatorio').not().isEmpty(),
    check('coinsPorSegundo', 'coinsPorSegundo es un campo obligatorio!').not().isEmpty(),
    validarCampos
], crearUsuario);

//Login de usuario
router.post('/',[
    check('email', 'El email es un campo obligatorio!').isEmail(),
    check('password', 'La contraseña es obligatoria!').isLength({min: 5}),
    validarCampos
], loginUsuario);

//Actualizo las monedas:
router.patch('/coins',[
    check('coins', 'Este campo es obligatorio.').not().isEmpty(),
    check('coinsPorSegundo', 'Este campo es obligatorio.').not().isEmpty(),
    validarCampos
],validarJWT, updateCoins);

//Actualizo los precios:
router.patch('/precios',[
    check('precios', 'Este campo es obligatorio.').not().isEmpty(),
    validarCampos
],validarJWT, updatePrecios)

//Actualizo el ranking:
router.get('/rank', getRanking)

//Exporto el modulo router linea 7:
module.exports = router
