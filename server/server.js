require('../config/config');

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path= require('path');
//Tanto get como post , pist etc... son simples convecciones.. es decir, cada uno de ellos puede realizar todas los tipos de peticiones.

//Las tres funciones de abajo son middlewares. Se ejecutan automáticamente cuando se ejecuta el código
// parse application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json

app.use(bodyParser.json())


app.use(express.static(path.resolve(__dirname ,'../public')));


app.use(require('./routes/index'))


///////// CONEXION CON LA BASE DE DATOS //////////////////

const option = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000};

mongoose.connect(process.env.URLDB,{ useNewUrlParser: true},
(error,respuesta)=>{

  if(error){throw error}

  else{console.log('Conexion con la base de datos establecida')}})


//////// DETERMINAR SERVIDOR (LOCAL/HEROKU) ///////////

app.listen(process.env.PORT,()=>{console.log(`Escuchando puerto ${process.env.PORT}`)})

console.log(`Entorno: ${process.env.NODE_ENV}`);
