const { response } = require("express");
const { validationResult } = require('express-validator')

//Valido los campos
const validarCampos = (req, res = response, next) => {
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        return res.status(400).json({ //bad request
            ok: false,
            msg: errores
        })
    }
    next();
}

//exporto:
module.exports = {
    validarCampos
}
