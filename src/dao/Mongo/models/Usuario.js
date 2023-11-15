const { Schema, model } = require("mongoose");

const collUsuarios = 'usuarios';

const schemaUsuarios = new Schema({
    nombre: String,
    apellido: String,
    email: {
        type: String, unique: true
    },
    password: String,
    cart: { type: Schema.Types.ObjectId, ref: 'Cart' },
    rol: String
})

module.exports = modeloUsuarios = model(collUsuarios,schemaUsuarios);