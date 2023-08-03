const  mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const Admin = mongoose.model('Admin'); 
//const path = require('path')

 
const UserSchema = new mongoose.Schema(
//modelo para el registro usuario
  {
    nombre: {type: String, lowercase: true, trim: true},
    apellidos: {type: String, lowercase: true, trim: true},
    matricula: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    fecha_de_alta:{type: Date, default: Date.now},
    departamento:{type:String, trim: true, required:true},
    primerlogin:{type:Boolean, default:true},
    jefe:{type:String, default:'none'},
    estado:{type:String, default:'DESACTIVE'},
    creado_por:{ type: Schema.ObjectId, ref: "Admin" },
  },
 
);

UserSchema.methods.encryptPassword = async (password) => { 
 // metodo para encriptar la contrasena
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt); 
};

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};



module.exports =  mongoose.model("User", UserSchema); 
