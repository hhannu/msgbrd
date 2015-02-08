var User = require('./database').User;
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
    
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true 
    },function(req,username,password,done){

        User.findOne({name:username},function(err,user){
            //Some error occured
            if(err){
                return done(err);
            }
            //No such user
            if(!user){
                return done(null, false, "failed to get user info");
            }
            //Incorrect password
            if(!user.validPassword(password)){
                return done(null, false, "wrong password"); 
            }
            //console.log('All success');
            // All fine continue
            return done(null, user);
        });
        
    }));
}