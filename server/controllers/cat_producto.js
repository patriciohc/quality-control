'use strict'

const CatProducto = require('../models/cat_producto');

function getCatProductos(req, res){
    CatProducto
    .find({})
    .exec(function(err, producto){
        if (err) return res.status(500).send({message: `Error al realizar la peticion ${err}`});
        if (!producto) return res.status(404).send({message: "No existen folios."});

        return res.status(200).send( producto )
    });
}

function getCatProducto(req, res) {
    CatProducto
    .find({ _id: req.body.id })
    .exec(function(err, producto){
        if (err) return res.status(500).send({message: `Error al realizar la peticion ${err}`});
        if (!producto) return res.status(404).send({message: "No existen folios."});

        return res.status(200).send( producto )
    });
}


function saveCatProducto(req, res) {
    var catProducto = new CatProducto(req.body);

    catProducto.save( function(err, cat){
        if (err) return res.status(500).send({message:"error al guardar" });

        return res.status(200).send(cat);
    });
}

module.exports = {
    getCatProductos,
    getCatProducto,
    saveCatProducto,
}
