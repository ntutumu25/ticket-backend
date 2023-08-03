const express = require('express')
const router = express.Router()
const {home} = require('../controllers/index.controller')
const {isAuthenticated} = require("../helpers/helpers")

//metodo http get
router.get('/', isAuthenticated, home)

// metodo http post
//router.post("/addTicket", addTicket)


module.exports = router 