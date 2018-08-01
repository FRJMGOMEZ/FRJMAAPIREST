const express= require('express');

const fs = require('fs');

const path = require('path');

let app = express();

const Producto = require('../models/producto');
const Usuario = require('../models/usuario');

const {verificaTokenImg} = require('../middlewares/autenticacion');



app.get('/imagen/:tipo/:img',verificaTokenImg,(req,res)=>{

  let tipo = req.params.tipo;
  let img = req.params.img;

  let noImagePath = path.resolve(__dirname,'../assets/Image not found.png');

  let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${img}`);

  if(fs.existsSync(pathImagen)){res.sendFile(pathImagen)}

  else{res.sendFile(noImagePath)}})




module.exports = app;
