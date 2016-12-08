'use strict'

const Producto = require('../models/producto');
const CatProducto = require('../models/cat_producto');
const estadistica = require('../estadistica.js');
const LINQ = require('node-linq').LINQ;

function getAtributo(req, res){
    var nameProducto = req.query.nameProducto;
    var query;
    if (nameProducto)
        query = {nombre: nameProducto}
    else {
        query = {}
    }

    var getValuesAtributo = function (data, atributo) {
        var datosCompletos = [];
        var values = []
        for (var i = 0; i < data.length; i++){
            var obj = data[i];
            let item = {};
            item.value = obj.atributos[atributo];
            item.identificador = obj.identificador;
            item.id = obj.id;
            
            datosCompletos.push(item);
            
            values.push(item.value);
        }       
        return {datosCompletos, values};
    }
    
    var fillPartialResponse = function(atributos, listProducto){
        var response = [];
        for (var i = 0; i < atributos.length; i++) {
            var atributo = atributos[i];
            var item = {};
            var data = getValuesAtributo(listProducto, atributo);
            item.atributo = atributo;
            item.data = data.datosCompletos;
            item.promedio = estadistica.getPromedio(data.values);
            item.desvStd = estadistica.desvStd(data.values);
            item.rango = estadistica.rango(data.values);
            item.moda = estadistica.moda(data.values);
            response.push(item);
        }
        return response;
    }

    Producto.find(query).exec(function(err, listProducto){
        if (err)
            return res.status(500).send({message: `Error mongo ${err}`});
        if (!listProducto)
            return res.status(404).send({message: "No existen productos."});

        if (req.query.atributo && nameProducto){
            var response = getValuesAtributo(listProducto, req.query.atributo);
            return res.status(200).send( response );
        } else if (nameProducto) {
            CatProducto.findOne({nombre: nameProducto},(err, catProducto)=>{
                if (err) res.status(500).send({message: `Error mongo: ${err}`});
                if (!catProducto) res.status(404).send({message: 'recurso no encontrado'});
                var response = fillPartialResponse(catProducto.atributos, listProducto);
                return res.status(200).send( response );
            });
        } else {
            var response = [];
            CatProducto.find({},(err, listCatProducto)=> {
                if (err) return res.status(500).send({message: `Error mongo: ${err}`});
                if (!listCatProducto) return res.status(404).send({message: 'recurso no encontrado'});

                for (var i = 0; i < listCatProducto.length; i++){
                    var catProducto = listCatProducto[i];
                    var producto = {nombre: catProducto.nombre}
                    var p = new LINQ(listProducto)
                    .Where(function(item){
                        return item.nombre == catProducto.nombre })
                    .Select(function(x){return x}).ToArray();
                    producto.data = fillPartialResponse(catProducto.atributos, p);
                    response.push(producto)
                }
                return res.status(200).send( response );
            });
        }
    });
}

function getProductos(req, res) {
    Producto
    .find({})
    .exec(function(err, producto){
        if (err) return res.status(500).send({message: `Error al realizar la peticion ${err}`});
        if (!producto) return res.status(404).send({message: "No existen folios."});

        return res.status(200).send( producto )
    });
}

function getProducto(req, res){
    var id = req.params.id;
    Producto
    .findOne({_id: id})
    .exec(function(err, producto){
        if (err) return res.status(500).send({message: `Error al realizar la peticion ${err}`});
        if (!producto) return res.status(404).send({message: "No existen folios."});

        return res.status(200).send( producto )
    });
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
    getProducto,
    getProductos,
    saveProducto,
    getAtributo,
}
