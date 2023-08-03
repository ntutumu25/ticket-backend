const User = require("../models/user")
const Ticket = require('../models/ticket')



const home = async(req, res)=>{
    const test = await Ticket.find().lean()
    res.status(200).json({sms:'hola mundo', test}) 
}
 

module.exports = {
    home
}
     