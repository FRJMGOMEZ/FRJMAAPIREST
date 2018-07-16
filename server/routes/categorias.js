const express = require('express');
const {verificadorToken} = require('../middlewares/autenticacion');
const {verificaAdministrador} = require('../middlewares/autenticacion');
const app = express();
const Categoria = require('../models/categoria');


///////   MOSTRAR TODAS LAS CATEGORIAS   //////

app.get('/categoria',[verificadorToken,verificaAdministrador],(req,res)=>{

  let desde = req.query.desde || 0 ;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  Categoria.find({})
         .exec((error,categorias)=>{

           if(error){return res.status(400).json({ok:false,
                                           mensaje:error})}
         Categoria.countDocuments({},(error,conteo)=>{

           res.json({categorias,
                     conteo})
           })
      })
})


///////  MOSTRAR SOLO UNA CATEGORIA POR SU ID  ////////

app.get('/categoria/:id',[verificadorToken,verificaAdministrador],(req,res)=>{

let id = req.params.id;

Categoria.findById(id,(error,categoriaDb)=>{

  if(error){return res.status(400).json({ok:false,
                                  message:'No se pudo encontrar la categoria'})}

  res.json({categoria:categoriaDb})

})})



////////////  CREAR NUEVA CATEGORIA   ///////////

app.post('/categoria',[verificadorToken,verificaAdministrador],(req,res)=>{

let body = req.body;

let categoria = new Categoria(
                {nombre:body.nombre,
                 descripcion:body.descripcion,
                 ID_usuario:req.usuario._id});

categoria.save((error,categoriaDb)=>{

  if(error){return res.status(500).json({ok:false,
                                  message:error})}

  res.json({categoria:categoriaDb})
})
})



///////////   ACTUALIZAR CATEGORIA   ///////////////

app.put('/categoria/:id',[verificadorToken,verificaAdministrador],(req,res)=>{

let id = req.params.id;

let body = req.body;

Categoria.findByIdAndUpdate(id,body,{new:true,
                                   runValidators:true},(error,categoriaDb)=>{

  if(error){return res.status(400).json({ok:false,
                                  message:error})}

  res.json({categoria:categoriaDb})
                                   })
                                 })


//////////  ELIMINAR CATEGORIA   ////////

app.delete('/categoria/:id',[verificadorToken,verificaAdministrador],(req,res)=>{

  let id = req.params.id;

  Categoria.findByIdAndRemove(id,(error,categoria)=>{

    if(error){return res.status(500).json({ok:false,
                                  mensaje:error})}

    if(!categoria){return res.status(400).json({ok:false,
                                         message:'La categoria no existe'})}

   res.json({ok:true,
             message:'Categoria borrada'})
})})


module.exports = app;
