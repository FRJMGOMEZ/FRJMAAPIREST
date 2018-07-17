const express= require('express');
const app= express();

const {verificadorToken} = require('../middlewares/autenticacion');

const {verificaAdministrador} = require('../middlewares/autenticacion');

const {categorizacion} = require('../middlewares/categorizacion');

const Producto = require('../models/producto');



app.get('/productos',verificadorToken,(req,res)=>{

  Producto.find({disponible:true})
          .populate('usuario')
          .populate('categoria')
          .exec((error,productos)=>{

             if(error){return res.status(400).json({ok:false,
                                            message:error})}
             if(productos.length === 0){return res.json({message:'No existen productos'})}

             res.json({productos})})})



app.get('/productos/:id',verificadorToken,(req,res)=>{

  let id = req.params.id;

  Producto.findById(id,(error,productoDb)=>{

    if(error){return res.status(400).json({ok:false,
                                           message:'No se pudo encontrar el producto'})}

    res.json({producto:productoDb})})})



app.get('/productos/buscar/:termino',verificadorToken,(req,res)=>{

let termino = req.params.termino;
/////Repasar las expresiones regulares cuando vuelva de La Manga.
let regEx = new RegExp(termino,'i');

  Producto.find({nombre:regEx})
          .populate('categoria','nombre')
          .exec((error,productos)=>{

            if(error){res.status(400).json({ok:false,
                                            message:error})}

            res.json({ok:true,
                      productos})})})




app.post('/productos',[verificadorToken,categorizacion],(req,res)=>{

  let body = req.body;

  let producto = new Producto({nombre:body.nombre,
                               precioUni:body.precioUni,
                               descripcion:body.descripcion,
                               disponible:body.disponible,
                               categoria:req.categoria._id,
                                usuario:req.usuario._id})
  producto.save((error,producto)=>{

    if(error){return res.status(400).json({ok:false,
                                    message:error})}

    res.json({producto})})})





app.put('/productos/:id',verificadorToken,(req,res)=>{

  let id = req.params.id;

  let body = req.body;

  Producto.findByIdAndUpdate(id,body,{new:true,
                                     runValidators:true},(error,productoDb)=>{

    if(error){return res.status(400).json({ok:false,
                                    message:error})}

    res.json({producto:productoDb})})})




app.delete('/productos/:id',verificadorToken,(req,res)=>{

      let id = req.params.id;

      let nuevoEstado = {disponible:false};

      Producto.findByIdAndUpdate(id,nuevoEstado,(error,producto)=>{

        if(error){return res.status(500).json({ok:false,
                                      mensaje:error})}

        if(!producto){return res.status(400).json({ok:false,
                                             message:'El producto no existe'})}

       res.json({ok:true,
                 message:`Producto ${producto.nombre} fuera de stock`})})})




module.exports = app;
