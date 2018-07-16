const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;


let categoriaSchema = new Schema({
  nombre:{
    type:String,
    required:[true,'El nombre es necesario'],
    unique:true},
  descripcion:{
    type:String,
    required:[true, 'La descripcion es necesaria']
    },
  ID_usuario:{
    type:String,
    required:true},
  items:[]
})

categoriaSchema.plugin(uniqueValidator, ({message: '{PATH} debe de ser unico'}))

module.exports = mongoose.model('Categoria',categoriaSchema);
