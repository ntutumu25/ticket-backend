const express = require('express')
const router = express.Router()
const {isAuthenticated} = require("../helpers/helpers")

const {login, updateUser, primerLogin, getTicket,
    addTicket} = require("../controllers/user.controller")

//------------METODOS GET-------------------------------------------------------
router.get('/update', updateUser) // ruta privilegios de login admin backend
router.get('/ticket/:option/:usuario/:departamento', getTicket) // ruta para obtener tickets



// ---------------METODOS POST--------------------------------------------------
router.post("/auth/user", login) // ruta login frontend
router.post('/first/login', primerLogin) // ruta primerlogin actulizar mot de pass
router.post('/addTicket', addTicket) // ruta para agregar un ticket


module.exports = router 