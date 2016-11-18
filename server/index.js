'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config');
const api = require('./routers');

const app = express();

app.use(express.static("www"));
// Middlewares
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); 

app.use('/api', api)

mongoose.connect(config.db, (err, res) => {
    if (err) {
        console.log(`error en la conexion de la base de datos: ${err}`);
        return;
    }
    console.log("conexion establecida...")

    app.listen(config.port, () =>{
        console.log("servidor corriendo en http://localhost:8080");
    });
});