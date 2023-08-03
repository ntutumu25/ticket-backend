const helpers = {}

helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_sms", "Not Authorized.");
    res.redirect("/auth/login");
  }; 
  
module.exports = helpers
