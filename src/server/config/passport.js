var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Users = require('../models/users');

passport.use(new LocalStrategy(
    function(username, password, done) {
        Users.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));