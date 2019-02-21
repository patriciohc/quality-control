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


function updataCatProducto(req, res) {
    var id = req.body.id;
    var atributos = req.body.atributos;
    CatProducto
    .findOne({_id: id})
    .exec(function(err, obj){
        if (err) return res.status(500).send({message: `error en el servidor ${err}`});

        if (!obj) return res.status(404).send({message: "no se encontro el elemento"});
        
        for (var i in atributos) {
            var a = atributos[i];
            var cmp = obj.atributos.indexOf(a);
            if (obj.atributos.indexOf(a) == -1){
                obj.atributos.push(a);
            }
        }
        CatProducto.update({_id: id}, {atributos:  obj.atributos}, (err, obj) =>{
            if (err) {
                return res.status(500).send({message: `error en el servidor ${err}`});
            } else {
                return res.status(200).send({message: 'se actualizó correctamente'});
            }
        });
    });

}



module.exports = {
    getCatProductos,
    getCatProducto,
    saveCatProducto,
    updataCatProducto,
}
