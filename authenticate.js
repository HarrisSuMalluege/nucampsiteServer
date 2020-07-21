/*
2020-07-16
This file is to create the json web token authorization
by: harris.su.malluege@gmail.com
*/

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');


const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
// used to create, sign and verify tokens
const jwt = require('jsonwebtoken');
const FacebookTokenStrategy = require('passport-facebook-token');

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

// setting json web token strategy for passport
exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts, (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            // search user id in database
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    return done(err, false);    
                } else if (user) {
                    return done(null, user);    // none error, and return the user has found
                }
                else {
                    return done(null, false); //null: none error; false: no user found
                }
            });
        }
    )
);

// export the verifyUser module with passport has been encrypted 
exports.verifyUser = passport.authenticate('jwt', { session: false }); // jwt argument is to use jwt strategy, and the second argument session is false which means that there is no session.

// export and create the verify admin middleware module
exports.verifyAdmin = function (req, res, next) {
  if (req.user.admin) {
    next();
    return;
  } else {
    const err = new Error("You are not authrized to perform this operation!");
    err.status = 403;
    return next(err);
  }
};

// Set up Facebook authentication strategy
exports.facebookPassport = passport.use(
    new FacebookTokenStrategy(
        {
            clientID: config.facebook.clientId,
            clientSecret: config.facebook.clientSecret
        },
        (accessToken, refreshToken, profile, done) => {
            User.findOne({facebookId: profile.id}, (err, user) => {
                if (err) {
                    return done(err, false);
                }
                if (!err && user) {
                    return done(null, user);
                } else {
                    user = new User({username: profile.displayName});
                    user.facebookId = profile.id;
                    user.firstname = profile.name.givenName;
                    user.lastname = profile.name.familyName;
                    user.save((err, user) => {
                        if (err) {
                            return done(err, false);
                        } else {
                            return done(null, user);
                        }
                    });
                }
            });
        }
    )
)