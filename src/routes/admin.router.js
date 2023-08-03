const express = require('express')
const router = express.Router()
const {isAuthenticated} = require("../helpers/helpers")

const {registerFormAdmin, 
    registerUser, loginFormAdmin, 
    registerAdmin, admin, 
    buscar,login, getUser,logout, userEdite, edite,
    test } = require('../controllers/admin.controller')
const { is } = require('express/lib/request')


// rutas del lado del servidor para la administracion

// metodos get de la parte admin de la app
router.get('/auth/register', registerFormAdmin)// ruta para mostrar el formularion de registo de un administrdor
router.get('/auth/login', loginFormAdmin)// ruta para mostrar el form login del admin
router.get('/admin', isAuthenticated,admin) // ruta para mostrar el espacio de herramientas del administrador
router.get('/auth/logout', logout) // metodo para cerrar la session del usuario admin
router.get('/list/user', isAuthenticated,getUser) // ruta para obtener lista de los usuarios registrados
router.get('/edite/user/:id', userEdite) // ruta para obtener el usuario a editar por el id



// metodos post del lado del servidor para la administracion
router.post('/register/user', isAuthenticated,registerUser) // ruta para crear un usuario del frontend
router.post('/edite/user', edite)
router.post('/buscar/user', isAuthenticated,buscar) // ruta de busqueda usuarios fronted
router.post('/auth/register',registerAdmin) // ruta para crear un usuario admin
router.post('/auth/login', login) // ruta para logear el usuario admin


module.exports = router 