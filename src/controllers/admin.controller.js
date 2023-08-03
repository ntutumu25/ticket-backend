const passport = require("passport")
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const Admin = require("../models/admin")


// FUNCIONES CONCERNIENTES AL LADO DEL ADMINISTRADOR EN EL LADO SERVIDOR
const registerFormAdmin = (req, res) => {
    // la funcion que retorna el formulario de registro de los adminstradore
    res.render("./admin/register")
}
// funciones para peticiones get
const loginFormAdmin = (req, res) => {
    // formulario de login del admin
    res.render("./admin/login")
}

const logout = async (req, res, next) => {
    // logout del administrador
    await req.logout((err) => {
        if (err) return next(err);
        req.flash("success_msg", "vous etes hors de la session");
        res.redirect("/auth/login");
    });
};

const admin = async(req, res)=>{
    // info del espacio admin
    //const adminUser = await Admin.findOne({ _id: req.admin.id })

    //req.flash("titulo", 'hola mundo');
    res.render('./admin/spaceAdmin')
}

//funciones para peticiones post
const registerAdmin = async (req, res) => {
    // funcion de registro de usuarios del api
    let errors = [];
    const { nombre, apellidos, matricula, password, confirm_password} = req.body;
    if (password !== confirm_password) {
        errors.push({ text: "Passwords do not match." });
    }
    // verificar si la contrasena tiene menos de 3 caracteres
    if (password.length < 4) {
        errors.push({ text: "Minimum de 4 caractères pour le mot de pass" });
    }
    // verificar si la contrasena tiene algun caracter
    if (errors.length > 0) {
        return res.render("./admin/register", {
            errors,
            nombre,
            apellidos,
            password,
            confirm_password,
            matricula,
        });
    }

    // verificar si la matricula ya existe en la base de datos
    const userFound = await Admin.findOne({ matricula: matricula });
    if (userFound) {
        errors.push({ text: `il y'a existe un admin avec la matricule ${matricula}` });
        return res.render("./admin/register", { errors });
    }

    // Guardar usuario
    const newAdmin = new Admin({nombre, apellidos, matricula, password});
    newAdmin.password = await newAdmin.encryptPassword(password);
    
    await newAdmin.save();

    req.flash("success_sms", "vous venez d'etre registe avec success");
    res.redirect("/auth/login");
}

const test = async (req, res) => {
    console.log(req.body)
    res.json({
        'salutation': 'bonjour hollprody'
    })
}

const login = passport.authenticate("local", {
    // verificacion de la autentificacion del usuario por pasport
  successRedirect: "/admin",
  failureRedirect: "/auth/login",
  failureFlash: true,
});



//-----------------------------------------------------------

// FUNCIONES CONCERNIENTES AL LADO DEL LOS USUARIOS EN LA PARTE ADMIN EN EL LADO SERVIDOR
const getUser = async (req, res) =>{
    // funcion para obtener los usuarios frontend 
    User.find({},  function (err, userFound){
        Admin.populate(userFound, { path: "creado_por" }, function (err, userFound){
            for(i=0; i<userFound.length; i++){
                userFound[i].fecha_de_alta = userFound[i].fecha_de_alta.toLocaleDateString('FR') 
            }
            res.status(200).json({userFound})
        })
    }).sort({ fecha_de_alta: "desc", fecha_de_alta: -1  }).lean();

}

const buscar = async(req, res) =>{
    const {valorBusqueda} = req.body
    
    User.find({nombre:{ $regex: valorBusqueda }},  function (err, userFound){
        Admin.populate(userFound, { path: "creado_por" }, function (err, userFound){
            for(i=0; i<userFound.length; i++){
                userFound[i].fecha_de_alta = userFound[i].fecha_de_alta.toLocaleDateString('FR') 
            }
            res.status(200).json({userFound})
        })
    }).sort({ fecha_de_alta: "desc", fecha_de_alta: -1  }).lean();

 
}

const registerUser = async (req, res) => {
    // funcion de registro de usuarios del api
    let alerta = [];
    let { nombre, apellidos, matricula, departamento } = req.body;
    console.log(req.body)

    nombre = nombre.toLowerCase()
    apellidos = apellidos.toLowerCase() 

    const password = nombre[0]+''+apellidos[0]+'@1959'
    const confirm_password = nombre[0]+''+apellidos[0]+'@1959'

    // verificar si la contrasena tiene menos de 6 caracteres
    if (password.length < 7) {
        alerta.push({ text: 'Minimum de 8 caractères pour le mot de pass' });
    }
    //comparacion del password 
    if (password !== confirm_password) {
        alerta.push({ text: "Pas de coincidance pour le mot de pass" });
        return res.json({alerta});
    } 
    
    // verificar si la contrasena tiene algun caracter
    if (alerta.length > 0) {
        return res.json({alerta});
    }

    // verificar si la matricula ya existe en la base de datos
    const userFound = await User.findOne({ matricula: matricula });
    if (userFound) {
        alerta.push({ text: `La matricule ${matricula} éxiste` });
        return res.json({ alerta });
    }
   
    // Guardar usuario 
    
    const newUser = new User({nombre ,apellidos,matricula, creado_por:req.user.id,
        departamento, password}); 
    newUser.password = await newUser.encryptPassword(password);
    await newUser.save();

    alerta.push({ text: 'exito'});
    res.json({alerta}) 
}

const userEdite = async(req, res)=>{
    //funcion para editar el usuario selecionado y mostrar los datos a editart
    const {id} = req.params
    const usuarios = await User.find({_id:id}).lean()
    const usuario = usuarios[0]
    if(usuarios.length>0){
        res.status(200).json({"respuesta":'exito', usuario})
    }else{
        res.status(200).json({"respuesta":'error'})
    }
    
}

const edite = async(req, res)=>{
    //let alerta = [];
    const {id, nombre, apellidos, matricula, jefe, departamento, estado} = req.body

    const userAnterior = await User.findById(id).lean()
    //console.log(userAnterior)

    if(userAnterior.matricula == matricula){
        
        if(departamento==jefe){
            const testJefe = await User.find({jefe}).lean()
            if(testJefe.length>0&&jefe!=userAnterior.jefe){
                res.status(200).json({respuesta:{
                    tipo:'error',
                    sms:"il y'a un pilote pour ce departement"
                }})

            }else{
                await User.findByIdAndUpdate(id, {nombre, apellidos, departamento, jefe, estado})
                res.status(200).json({respuesta:{
                    tipo:'exito',
                    sms:'Sauve avec success'
                }})
            }
            
            //await User.findByIdAndUpdate(id, {nombre, apellidos, departamento, jefe, estado})
            
        }else if(jefe=='none'){
            await User.findByIdAndUpdate(id, {nombre, apellidos, departamento, jefe,estado})
            res.status(200).json({respuesta:{
                tipo:'exito',
                sms:'Sauvé avec succès'
            }})
        }else{
            console.log('hola mundo')
            res.status(200).json({respuesta:{
                tipo:'error',
                sms:'le pilote ne correspond pas au departement'
            }})
        } 
        
    }else{
        const testMatricula = await User.find({matricula}).lean()
        if(testMatricula.length>0){
            res.status(200).json({respuesta:{
                tipo:'error',
                sms:`la matricule ${matricula} éxite déja`
            }})

        }else{
            if(departamento==jefe){
                const testJefe = await User.find({jefe}).lean()
                if(testJefe.length>0&&jefe!=userAnterior.jefe){
                    res.status(200).json({respuesta:{
                        tipo:'error',
                        sms:"il y'a un pilote pour ce departement"
                    }})
    
                }else{
                    await User.findByIdAndUpdate(id, {nombre, matricula,apellidos, departamento, jefe, estado})
                    res.status(200).json({respuesta:{
                        tipo:'exito',
                        sms:'Sauve avec success'
                    }})
                }
                
                //await User.findByIdAndUpdate(id, {nombre, apellidos, departamento, jefe, estado})
                
            }else if(jefe=='none'){
                await User.findByIdAndUpdate(id, {nombre, matricula,apellidos, departamento, jefe,estado})
                res.status(200).json({respuesta:{
                    tipo:'exito',
                    sms:'Sauve avec success'
                }})
            }else{
                console.log('hola mundo')
                res.status(200).json({respuesta:{
                    tipo:'error',
                    sms:'le pilote ne correspond pas au departement'
                }})
            }
        }
        
    }
}




module.exports = {
    registerFormAdmin,
    registerUser,
    loginFormAdmin,
    registerAdmin,
    login,
    getUser,
    buscar,
    logout,
    admin,
    test,
    userEdite,
    edite

}