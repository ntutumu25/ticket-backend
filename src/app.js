//********************IMPORTACIONES DE LOS MODULOS REQUERIDOS**************************
const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require("connect-mongo");
const flash = require("connect-flash")
const passport = require("passport")
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const morgan = require('morgan')
//const multer = require('multer')
//const uuid = require('uuid')
const { format } = require('timeago.js');
//***************** FIN DE LAS IMPORTACIONES DE LOS MODULOS**********************


//****************INICIALIZACIONES***************************************
app = express()
require('./config/db')// inicializacion de la base de datos config
require("./config/passport")// passport para la autentificacion 
require("dotenv").config()//configuracion de las variables de entorno
 



//*********************CONFIGURACIONES*************************
app.set('port', process.env.PORT) //configuracion del puerto
app.set('views', path.join(__dirname, 'views')) //indicar a node el lugar de las vistas

//*************configuracion del motor de vistas*******************


const hbs = exphbs.create({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layout"),
    partialsDir: path.join(app.get("views"), "partial"),
    extname: ".hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  });
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')


//************MIDDLEWEARES*****************
 
app.use(morgan('dev'))// middleware para ver las peticiones http en la terminal
app.use(express.urlencoded({extended: false}))
app.use(express.json()) //midd para el uso del methodo json en las respuestas
app.use(methodOverride('_method')) //middlewer para enviar otros methodos en los forms PUT, DELETE
app.use(session({
    secret: 'ntutumu25',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: "mongodb://localhost:27017/testTicket" }),
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());

 
//*******************global variables***********************
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.locals.success_msg = req.flash("success_sms");
    res.locals.error_msg = req.flash("error_sms");
    res.locals.titulo_msg = req.flash("titulo");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    app.locals.formats = format; 
    next();
  });
 

  //static routes
app.use(express.static(path.join(__dirname,'../public'))); //llamar archivos staticos

//routes 
app.use(require('./routes/index.router'))
app.use(require('./routes/user.router'))
app.use(require('./routes/admin.router'))

app.use((req, res)=>{
  // pagina para el error 404
  res.sendFile(path.join(__dirname,'../public/404.html'))
})






app.listen(app.get("port"), ()=>{
    console.log("Servidor en el puerto", app.get('port'))

})
