const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const  Admin = require("../models/admin.js");

passport.use(
  new LocalStrategy(
    {
      usernameField: "matricula",
    },async (matricula, password, done) => {
      // relacion el correo con el usuario
      const user = await Admin.findOne({ matricula: matricula });

      if (!user) {
        // verificacion si el usuario exite
        return done(null, false, { message: "Erreur de matricule ou de mot de pass" });
      }
      if(!user.root){
        // verificacion si el usuario tiene permiso de root
        return done(null, false, { message: "cette compte n'est pas active, consulter l'administrateur" });
      }

      // relacion la contrase con la del usuario
      const isMatch = await user.matchPassword(password);
      if (!isMatch)
        return done(null, false, { message: "Erreur de matricule ou de mot de pass" });
      
      return done(null, user); 
    }
  )
);

// crear una session del usuario

passport.serializeUser((user, done) => {
  done(null, user.id);
});

// cerrar sesion
passport.deserializeUser((id, done) => {
  Admin.findById(id, (err, user) => {
    done(err, user);
  });
});
