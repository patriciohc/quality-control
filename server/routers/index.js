'use strict'

const express = require('express');
const api = express.Router()
const productoCtrl = require('../controllers/producto');
//const middleware = require('../middleware');

// folios
//api.get('/producto/:id', folioCtrl.getFolio);
api.get('/producto/', productoCtrl.getProductos);
api.post('/producto/',productoCtrl.saveProducto);
//api.put('/prodcuto/', folioCtrl.updateFolio);
//api.delete('/producto/:id', folioCtrl.deleteFolio );


module.exports = api