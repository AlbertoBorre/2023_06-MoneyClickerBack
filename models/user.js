const {Schema, model} = require('mongoose');

const userSchema = Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    coins:{
        type: Number,
        require: true
    },
    coinsPorSegundo: {
        type: Number,
        require: true
    },
    precios:{
        type: Object,
        require: true
    }
})

module.exports = model('user', userSchema);
