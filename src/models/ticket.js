// inicio de importaciones de modulos
const  mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = mongoose.model('User');

 
const TicketSchema = new mongoose.Schema(
//modelo para crear ticket
  {
    titulo: {type: String, uppercase:true, require:true},
    autor: { type: Schema.ObjectId, ref: "User" }, 
    departamento_origen:{type: String, trim:true},
    departamento_objetivo:{type: String, trim:true},
    prioridad: { type: String, trim: true },
    estado: { type: Boolean, required: true, default:true},
    fecha_creacion:{type: Date, default: Date.now},
    usuario_cirre:{type:String},
    fecha_cirre:{type: Date},
    comentarios:[
      {
        usuario: {type:String},
        comentario:{type:String, lowercase:true},
        fecha:{type:Date, default:Date.now}
      }
    ]
    
  },
 
);

module.exports =  mongoose.model("Ticket", TicketSchema); 
