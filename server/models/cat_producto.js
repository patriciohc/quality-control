'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CatProductoSchema = Schema({
    nombre: {type: String, unique: true}
    atributos: []
});

module.exports = mongoose.model('CatProducto', CatProductoSchema);
