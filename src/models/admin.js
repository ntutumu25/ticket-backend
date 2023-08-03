const  mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

 
const UserSchema = new mongoose.Schema(
//modelo para el registro usuario
  {
    nombre: {type: String, trim: true},
    apellidos: {type: String, trim: true},
    matricula: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    fecha_de_alta:{type: Date, default: Date.now},
    root:{type:Boolean, default:false}
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



module.exports =  mongoose.model("Admin", UserSchema); 
