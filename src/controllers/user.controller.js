//importacion de los modelos
const User = require("../models/user")
const Ticket = require('../models/ticket')
const Admin = require('../models/admin')
//--------------------------------

const {format} = require('timeago.js')
const bcrypt = require("bcryptjs");
//const Post = require("../models/post")
const jwt = require("jsonwebtoken")


///----------------------------------------------------

const login = async(req, res)=>{
  // verificacion de la autentificacion del usuario en el frontend
  const {matricula, password} = req.body
  const testUser = await User.find({matricula})
  console.log(testUser)
  
  if(testUser.length>0){
   
    if(testUser[0].estado=='DESACTIVE'){
      res.status(200).json({respuesta:{
        tipo:'error',
        sms:"Compte desactivé consulter l'administrateur"
      }})
    }
    const testPassword= await testUser[0].matchPassword(password);
    console.log(testPassword)
    if(testPassword){
        //const token = jwt.sign(req.body, "rsi/mteo", {expiresIn:"5m"}) 
        res.status(200).json({respuesta:{
          tipo:'exito',
          sms:'login'
        }, user:testUser[0]})
      }else{
        res.status(200).json({respuesta:{
          tipo:'error',
          sms:'Erreur de matricule ou de mot de pass'
        }})
      }
    }else{  
      res.status(200).json({respuesta:{
        tipo:'error',
        sms:'Erreur de matricule ou de mot de pass'
      }})
    }
  
  }

 
const updateUser = async (req, res)=>{
  // dar privilegios de login a un usuario admin
  const root = true
  const id = '6480f34575034c0992ebf5cf'
  await Admin.findByIdAndUpdate(id, {root});
 
  //req.flash("success_sms", "update succesfuly");
  res.redirect('/auth/login')

}

const primerLogin = async(req, res)=>{
  //funcion para actualizar la contrasen en el primer login 
  const {nuevoPsswd, confirmPsswd, userId} = req.body
  const testUser = await User.findById(userId)
  console.log(testUser)
  const testPassword= await testUser.matchPassword(nuevoPsswd)
 

  if(testPassword){
    res.status(200).json({respuesta:{
      tipo:'error',
      sms:'Mot de pass none accepte'
    }})
  }else{
    if(nuevoPsswd!=confirmPsswd){
      res.status(200).json({respuesta:{
        tipo:'error',
        sms:'Mot de pass none confirme'
      }})
    }
    
    else if(nuevoPsswd.length<8){
      res.status(200).json({respuesta:{
        tipo:'error',
        sms:'Minimum de 8 caracteres pour le mot de pass'
      }})
    }else{
      const salt = await bcrypt.genSalt(10);
      const pswd = await bcrypt.hash(nuevoPsswd, salt);  
      await User.findByIdAndUpdate(userId, {primerlogin:false, password:pswd})
      res.status(200).json({respuesta:{
        tipo:'exito',
        sms:'ok'
      }})
    }
    
  }
  
} 

const addTicket = async(req, res)=>{
  // funcion de agregar un ticket
  const {titulo,comentario,prioridad, departamento_objetivo,autor, departamento_origen} = req.body

  const newTicket = new Ticket({titulo,autor:autor._id,
    prioridad, departamento_origen, departamento_objetivo,
    comentarios:{usuario:autor.nombre+' '+autor.apellidos, comentario}})
    console.log(newTicket)
  await newTicket.save()
  res.status(200).json({sms:'exito'})
}

const getTicket = async(req, res)=>{
  // funcion para enviar los tickets almacenados
  
  if(req.params.option=='0'){
    // traer todos los ticket del dep_obj et dep_or igual al dep_usuario

    Ticket.find({$or: [{ departamento_origen:req.params.departamento },
      {departamento_objetivo:req.params.departamento}]}, function (err, ticket){
        User.populate(ticket, { path: "autor" }, function (err, ticket){
          console.log(ticket)
          res.status(200).json({ticket})
        })

    }).sort({ fecha_creacion: "desc" }).lean()

  }else if(req.params.option=='1'){
    // traer todos los ticket del dep_obj e dep_ori igual al dep_usuario y estado=true
    Ticket.find({$and:[{estado:true},{$or: [{ departamento_origen:req.params.departamento }, 
      {departamento_objetivo:req.params.departamento}]}]}, function (err, ticket){
        User.populate(ticket, { path: "autor" }, function (err, ticket){
          console.log(ticket)
          res.status(200).json({ticket})
        })

    }).sort({ fecha_creacion: "desc" }).lean()


  }else if(req.params.option=='2'){
     // traer todos los ticket del dep_obj e dep_ori igual al dep_usuario y estado=false
    
    Ticket.find({$and:[{estado:false},{$or: [{ departamento_origen:req.params.departamento }, 
      {departamento_objetivo:req.params.departamento}]}]}, function (err, ticket){
        User.populate(ticket, { path: "autor" }, function (err, ticket){
          console.log(ticket)
          res.status(200).json({ticket})
        })

    }).sort({ fecha_creacion: "desc" }).lean()


  }else if(req.params.option=='3'){
     // traer todos los ticket del usuario loggeado
     Ticket.find({autor:req.params.usuario}, function (err, ticket){
         User.populate(ticket, { path: "autor" }, function (err, ticket){
           console.log(ticket)
           res.status(200).json({ticket})
         })

     }).sort({ fecha_creacion: "desc" }).lean()

  }
  
}

module.exports = {
    login,
    updateUser,
    primerLogin,
    addTicket,
    getTicket
}
