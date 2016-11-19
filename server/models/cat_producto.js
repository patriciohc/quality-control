'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CatProductoSchema = Schema({
    nombre: String,
    atributos: []
});

module.exports = mongoose.model('CatProducto', CatProductoSchema);
