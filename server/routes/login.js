const express = require('express');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');

const app = express();


//////// OWN LOGIN //////////

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


//////////// GOOGLE LOGIN //////////////

async function verify(token) {
  const ticket = await client.verifyIdToken({
                                             idToken: token,
                                             audience: process.env.CLIENT_ID});
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  return {nombre:payload.name,
          email:payload.email,
          img:payload.picture,
          google:true}}


app.post('/google', async (req,res)=>{

  let token = req.body.idtoken;

  let googleUser = await verify(token)
                   .catch(error=>{res.status(403).json({ok:false,
                                                        message:'Credenciales incorrectas'})});

  Usuario.findOne({email:googleUser.email},(error,usuarioDb)=>{

    if(error){return res.status(500).json({ok:false,error})}

    if(usuarioDb){
      if(usuarioDb.google === false){res.status(400).json({ok:false,
                                                           message:'Debe de usar su autenticacion normal'})}
      else{
       let token = jwt.sign({usuario:usuarioDb},process.env.TOKEN_SEED,{expiresIn:60 * 60 * 24 * 30});
       return res.json({ok:true,
                        usuario:usuarioDb,
                        token})}}

    else{let usuario = new Usuario();

      usuario.nombre= googleUser.nombre;
      usuario.email= googleUser.email;
      usuario.img= googleUser.img;
      usuario.google= true;
      usuario.password= ':)',
      usuario.save((error,usuarioDb)=>{
        if(error){return res.status(500).json({ok:false,
                                      error})}
        let token = jwt.sign({usuario:usuarioDb},process.env.TOKEN_SEED,{expiresIn:60 * 60 * 24 * 30});
        return res.json({ok:true,
                        usuario:usuarioDb,
                        token})
      })
    }
  })
})

module.exports = app;
