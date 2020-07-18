/*
2020-07-16

*/

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');


const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
// used to create, sign and verify tokens
const jwt = require('jsonwebtoken');

// import the config secret key file
const config = require('./config.js');


exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// export get token module
exports.getToken = user => { //this user object will contain an ID for a user document
    return jwt.sign(user, config.secretKey, {expiresIn: 3600}); // use jwt.sign api method to return this function with user, secretkey and expiration time
};

// the options for the JWT strategy, and initialize it as an empty object
const opts = {};

// to define jwt request from extractjwt sending the http Authorization header as bearer token 
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

// setting the secret key
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts, (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            // search user id in database
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    return done(err, false);    // throughtout the error and no user found
                } else if (user) {
                    return done(null, user);    // none error, and return the user has found
                }
                else {
                    return done(null, false); //null: no error; false: no user found
                }
            });
        }
    )
);

// export the verifyUser module with passport has been encrypted 
exports.verifyUser = passport.authenticate('jwt', { session: false });