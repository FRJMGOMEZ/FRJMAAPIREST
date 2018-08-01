const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path');

const Producto = require('../models/producto');
const Usuario = require('../models/usuario');


app.use(fileUpload())

app.put('/upload/:tipo/:id', function(req, res) {

  let tipo = req.params.tipo;
  let id = req.params.id;

  if (!req.files)
    {return res.status(400).json({ok:false,
                                  message: 'No se encontraron archivos para descargar'})};

  /// VALIDAR TIPOS.
  let tiposValidos = ['productos','usuarios'];
  if(tiposValidos.indexOf( tipo ) < 0)
    {return res.status(400).json({ok:false,
                                  message: `La ruta especificada no es válida, los tipos permitidos son: ${tiposValidos.join(', ')}`})}

  ///VALIDAR TIPO DE ARCHIVO.

  let archivo = req.files.archivo;
  let nombreCortado = archivo.name.split('.');
  let extension = nombreCortado[nombreCortado.length-1];
  let extensionesValidas = ['png','jpg','gif','jpeg'];

    if(extensionesValidas.indexOf(extension) < 0){

       return res.status(500).json({ok:false,
                           message:`Tipo de archivo no permitido, las extensiones permitidas son ${extensionesValidas.join(', ')}`})}

  ///CAMBIAR NOMBRE AL ARCHIVO.
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (error,ok) => {

    if(error)
     {return res.status(500).json({ok:false,
                                   message:'No se ha guardado el archivo'})}})

  if(tipo ==='usuarios'){imagenUsuario(id,res,nombreArchivo,tipo)}

  else                  {imagenProducto(id,res,nombreArchivo,tipo)};

  })



  function imagenUsuario (id,res,nombreArchivo,tipo) {

    Usuario.findById(id,(error,usuarioDb)=>{

      if(error){borrarArchivo(nombreArchivo,tipo);
                return res.status(500).json({ok:false,
                                            message:error})}

      if(!usuarioDb){borrarArchivo(nombreArchivo,tipo);
                     return res.status(500).json({ok:false,
                                                  message:'El usuario no existe'})}

      if(usuarioDb.img){borrarArchivo(usuarioDb.img,tipo)}

      usuarioDb.img = nombreArchivo;

      usuarioDb.save((error,usuarioGuardado)=>{

        res.json({ok:true,
                  usuario:usuarioGuardado,
                  img:nombreArchivo})})})}





  function imagenProducto (id,res,nombreArchivo,tipo) {

    Producto.findById(id,(error,productoDb)=>{

      if(error){borrarArchivo(nombreArchivo,tipo);
                return res.status(500).json({ok:false,
                                             message:error})}

      if(!productoDb){borrarArchivo(nombreArchivo,tipo);
                      return res.status(500).json({ok:false,
                                                   message:'El producto no existe'})}

      if(productoDb.img){borrarArchivo(productoDb.img,tipo)}

      productoDb.img = nombreArchivo;

      productoDb.save((error,productoGuardado)=>{

        if(error){res.status(500).json({ok:false,
                                        message:'La imagen no se ha guardado'})}

        res.json({ok:true,
                  producto:productoDb,
                  img:nombreArchivo})})})}




  function borrarArchivo (nombreImagen,tipo) {

    let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${nombreImagen}`);

    if(fs.existsSync(pathImagen))
    {
      try {fs.unlinkSync(pathImagen);console.log(`Path ${nombreImagen} succesfully deleted`)}

     catch (err) {console.log('Ruta especificada no válida')}}}



module.exports = app;
