'use strict'

const Producto = require('../models/producto');

function getAtributo(req, res){
    var nameProducto = req.query.nameProducto;

    if (!nameProducto)
        return res.status(404).send({message: "especifique el nombre del producto"});

    var query = {nombre: nameProducto}

    Producto
    .find(query)
    .select({atributos: 1, _id: 0})
    .exec(function(err, producto){
        if (err)
            return res.status(500).send({message: `Error al realizar la peticion ${err}`});
        if (!producto)
            return res.status(404).send({message: "No existen productos."});

        let attrs = producto.map(function(obj){
            if (req.query.atributo)
                return obj.atributos[req.query.atributo];
            else
                return obj.atributos;
        });
        return res.status(200).send( attrs )
    });
}

function getProductos(req, res){
    Producto
    .find({})
    .exec(function(err, producto){
        if (err) return res.status(500).send({message: `Error al realizar la peticion ${err}`});
        if (!producto) return res.status(404).send({message: "No existen folios."});

        return res.status(200).send( producto )
    });
}

function updateFolio(req, res){


}

function saveProducto(req, res){
    Producto.collection.insert(req.body, function(err, docs){
        if (err) return res.status(500).send({message:"error al guardar" });

        return res.status(200).send({message:"Se guardo correctamente"});
    });

    // let producto = new Producto(req.body);
    // producto.save(function(err, productoStored){
    //     if (err) return res.status(500).send({message:"error al guardar" });

    //     return res.status(200).send({folio: productoStored});
    // });
}

module.exports = {
    getProductos,
    updateFolio,
    saveProducto,
    getAtributo,
}
