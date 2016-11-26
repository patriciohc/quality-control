'use strict'

const express = require('express');
const api = express.Router()
const productoCtrl = require('../controllers/producto');
const catProductoCtrl = require('../controllers/cat_producto');
//const middleware = require('../middleware');

// productos
api.get('/producto/', productoCtrl.getProductos);
api.post('/producto/',productoCtrl.saveProducto);
api.get('/atributo',productoCtrl.getAtributo);
// catalogo de productos
api.get('/cat-producto/', catProductoCtrl.getCatProductos);
api.post('/cat-producto/', catProductoCtrl.saveCatProducto);
api.get('/cat-atributo/:id', catProductoCtrl.getCatProducto);
api.put('/cat-producto/', catProductoCtrl.updataCatProducto);

module.exports = api
