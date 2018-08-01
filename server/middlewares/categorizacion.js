const express = require('express');
const app = express();
const Categoria = require('../models/categoria');


let categorizacion = (req,res,next)=>{

let body = req.body;

Categoria.findOne({nombre:body.categoria},(error,categoria)=>{

  if(error){ return res.status(400).json({ok:false,
                                  message:'La categoria no se ha cargado'})}
  if(!categoria){return res.status(400).json({ok:false,
                                  message:'La categoria no existe'})}

  req.categoria = categoria;

  next()})}

module.exports = {categorizacion};
