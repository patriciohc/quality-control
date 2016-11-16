'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductoSchema = Schema({
    nombre: String,
    identificador: {type: String, unique: true },
    fechaDeRegistro: { type: Date, default: Date.now },
    atributos: {}
});

module.exports = mongoose.model('Producto', ProductoSchema);