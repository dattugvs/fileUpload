var LocalStrategy   = require('passport-local').Strategy;
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var folderSchema = mongoose.Schema({
    folder : String, 
    files  : [{fname:String}],
    password : String
});

folderSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

folderSchema.methods.validPassword = function(password, type)
{
    return bcrypt.compareSync(password, this.password);
};

var  Folder = mongoose.model('folder', folderSchema);

module.exports = function (app, passport) {

    passport.serializeUser(function(req, user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(req, id, done) {
        Folder.findById(id, function(err, user) {  
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'folder',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, folder, password, done) {
        process.nextTick(function() {
            var newfolder = Folder(req.body);
            newfolder.password = newfolder.generateHash(newfolder.password);
            newfolder.save((err, folder) => {
                console.log("folder:"+folder);
                return done(null, folder);
            }); 
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField : 'folder',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, folder, password, done) {
        process.nextTick(function() {
            Folder.findOne({'folder':folder}, (err, folder) => {
                isMatch = folder.validPassword(password);
                if(isMatch)
                    return done(null, folder);
                else
                    return done(null, false);
            });
        });
    }));
};
