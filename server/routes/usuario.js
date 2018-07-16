const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const {verificadorToken} = require('../middlewares/autenticacion');
const {verificaAdministrador} = require('../middlewares/autenticacion');


app.get('/usuario',[verificadorToken,verificaAdministrador], (req, res)=> {

let desde = req.query.desde || 0 ;
desde = Number(desde);

let limite = req.query.limite || 5;
limite = Number(limite);

//Entre los corchetes podemos hacer cualquier filtro.
Usuario.find({estado:true})
       .skip(desde)
       .limit(limite)
       .exec((error,usuarios)=>{

         if(error){return res.status(400).json({ok:false,
                                         mensaje:error})}

       Usuario.countDocuments({estado:true},(error,conteo)=>{

         res.json({ok:true,
                   usuarios,
                   conteo})
         })
    })
})



app.post('/usuario',[verificadorToken,verificaAdministrador],(req, res)=> {

  let body = req.body;

  let usuario = new Usuario({
    nombre:body.nombre,
    email:body.email,
    password:bcrypt.hashSync(body.password,10),
    role:body.role,})

  usuario.save((error,usuarioDb)=>{

    if(error){return res.status(400).json({ok:false,
                                    mensaje:error})}

    usuarioDb.password = null;

    res.json({ok:true,
              usuario:usuarioDb}) })})




//Es importante diferenciar entre ruta y parametro.En el caso de abajo, ':id' es el parametro que introducimos.
app.put('/usuario/:id',[verificadorToken,verificaAdministrador],(req, res)=> {

    let id = req.params.id;


    let body = _.pick(req.body,['nombre','email','img','role','estado']);

    //Lo único que no puedo cambiar es el email, ya que salta la validación de unique.
    Usuario.findByIdAndUpdate(id,body,{new:true,
                                       runValidators:true},(error,usuarioDb)=>{

      if(error){return res.status(400).json({ok:false,
                                      mensaje:error})}

      res.json({ok:true,
                usuario:usuarioDb})
      })})





app.delete('/usuario/:id',[verificadorToken,verificaAdministrador], (req, res)=> {

  let id = req.params.id;

  let body = _.pick(req.body,['estado']);

  let cambiaEstado = {
      estado: false
  };

  Usuario.findByIdAndUpdate(id,cambiaEstado,{new:true},(error,usuarioBorrado)=>{

    if(error){return res.status(400).json({ok:false,
                                  mensaje:error})}

    if(usuarioBorrado===null) {return res.status(400).json({ok:false,
                                                    message:'El usuario no existe'})}

    res.json({ok:true,
              usuario:usuarioBorrado})
})
})






module.exports = app;
