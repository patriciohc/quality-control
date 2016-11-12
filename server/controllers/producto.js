'use strict'

const Producto = require('../models/producto');

function getProductos(req, res){
    Producto.find({}, function(err, producto){
        if (err) return res.status(500).send({message: `Error al realizar la peticion ${err}`});
        if (!producto) return res.status(404).send({message: "No existen folios."});

        return res.status(200).send({ producto })
    });
}

function updateFolio(req, res){


}

function saveProducto(req, res){
    let producto = new Producto(req.body);
    Producto.save(function(err, productoStored){
        if (err) return res.status(500).send({message:"error al guardar" });

        return res.status(200).send({folio: productoStored});
    });
}

module.exports = {
    getProductos,
    updateFolio,
    saveProducto,
}