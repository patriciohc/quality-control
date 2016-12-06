'use strict'

const Producto = require('../models/producto');
const CatProducto = require('../models/cat_producto');
const estadistica = require('../estadistica.js');

function getAtributo(req, res){
    var nameProducto = req.query.nameProducto;
    var query;
    if (nameProducto)
        query = {nombre: nameProducto}
    else {
        query = {}
    }

    var getValuesAtributo = function (data, atributo) {
        let values = data.map(function(obj){
            let item = {};
            item.value = obj.atributos[atributo];
            item.identificador = obj.identificador;
            item.id = obj.id;
            return item;
        });
        return values;
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
            var response = [];
            CatProducto.findOne({nombre: nameProducto},(err, catProducto)=>{
                if (err) res.status(500).send({message: `Error mongo: ${err}`});
                if (!catProducto) res.status(404).send({message: 'recurso no encontrado'});

                for (var i = 0; i < catProducto.atributos.length; i++) {
                    var atributo = catProducto.atributos[i];
                    var item = {};
                    item.atributo = atributo;
                    item.data = getValuesAtributo(listProducto, atributo);
                    item.promedio = estadistica.getPromedio(item.data);
                    item.desvStd = estadistica.desvStd(item.data);
                    item.rango = estadistica.rango(item.data);
                    response.push(item);
                }
                return res.status(200).send( response );
            });
        } else {
            var response = [];
            CatProducto.find({},(err, lisCatProducto)=>{
                if (err) res.status(500).send({message: `Error mongo: ${err}`});
                if (!catProducto) res.status(404).send({message: 'recurso no encontrado'});

                for (var i = 0; i < listCatProducto.length; i++){
                    var catProducto = listCatProducto[i];
                    var producto = {nombre: catProducto.nombre, data: []}
                    var p = $linq(listProducto)
                    .where(function(item){
                        return item.nombre == catProducto.nombre })
                    .select(function(x){return x}).toArray();
                    for (var i = 0; i < catProducto.atributos.length; i++) {
                        var atributo = catProducto.atributos[i];
                        var item = {};
                        item.atributo = atributo;
                        item.data = getValuesAtributo(p, atributo);
                        item.promedio = estadistica.getPromedio(item.data);
                        item.desvStd = estadistica.desvStd(item.data);
                        item.rango = estadistica.rango(item.data);
                        producto.data.push(item);
                    }
                    response.push(producto)
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
