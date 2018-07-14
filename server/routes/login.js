const express = require('express');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();



app.post('/login', (req,res)=>{

  let body = req.body;

  Usuario.findOne({email:body.email},(error,usuarioDb)=>{

    if(error){return res.status(400).json({ok:false,
                                           error})}

    if(!usuarioDb){return res.status(500).json({ok:false,
                                   message: '(Usuario) o contraseña incorrectos'})}

    if (!bcrypt.compareSync(body.password,usuarioDb.password)) {

    return res.status(500).json({ok:false,
                                 message: 'Usuario o (contraseña) incorrectos'})}

    let token = jwt.sign({usuario:usuarioDb},process.env.TOKEN_SEED,{expiresIn:60 * 60 * 24 * 30});

    res.json({ok:true,
              usuario:usuarioDb,
              token})})})

module.exports = app;
