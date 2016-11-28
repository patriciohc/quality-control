'use strict'

const Producto = require('../models/producto');
const CatProducto = require('../models/cat_producto');
const estadistica = require('../../www/utilities/estadistica.js');

function getAtributo(req, res){
    var nameProducto = req.query.nameProducto;

    if (!nameProducto)
        return res.status(404).send({message: "especifique el nombre del producto"});

    var query = {nombre: nameProducto}

    var getValuesAtributo = function (data, atributo){
        let values = data.map(function(obj){
            let item = {};
            item.value = obj.atributos[atributo];
            item.identificador = obj.identificador;
            return item;
        });
        return values;
    }

    Producto
    .find(query)
    .select({atributos: 1, _id: 0})
    .exec(function(err, producto){
        if (err)
            return res.status(500).send({message: `Error mongo ${err}`});
        if (!producto)
            return res.status(404).send({message: "No existen productos."});

        if (req.query.atributo){
            var response = getValuesAtributo(producto, req.query.atributo);
            return res.status(200).send( response );
        } else {
            var response = [];
            CatProducto.findOne({nombre: nameProducto},(err, catProducto)=>{
                if (err) res.status(500).send({message: `Error mongo: ${err}`});
                if (!catProducto) res.status(404).send({message: 'recurso no encontrado'});

                for (var i = 0; i < catProducto.atributos.length; i++) {
                    var atributo = catProducto.atributos[i];
                    var item = {};
                    item.atributo = atributo;
                    item.data = getValuesAtributo(producto, atributo);
                    item.promedio = estadistica.getPromedio(item.data);
                    item.desvStd = estadistica.desvStd(item.data);
                    item.rango = estadistica.rango(item.data);
                    response.push(item);
                }
                return res.status(200).send( response );
            });   
        }
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
    console.log(req.body);
    Producto.collection.insert(req.body, function(err, docs){
        if (err){ 
            console.log(err);
            return res.status(500).send({message:"error al guardar" });
        }

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
