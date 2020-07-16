var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');

// Adding mongoose modules and initiallizing the enviroment
const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/nucampsite';
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// To handle the promise that's returned from the connect method
connect.then(()=> console.log('Connected correctly to server'), err => console.log(err));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// using singed cookie, to provide the cookie parser with a secret key as an argument 
app.use(cookieParser('12345-67890-09876-54321'));

function auth(req, res, next) {
  // console.log(req.headers);
  // To use signedCookies to identify whether a user use cookie or not 
  if(!req.signedCookies.user) {
    const authHeader = req.headers.authorization;
    // Check for basic auth header
    if (!authHeader) {
      const err = new Error('You are not authenticatied!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
    // Verify auth credentials
    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];
    if (user === 'admin' && pass === 'password') {
      res.cookie('user', 'admin', {signed: true});
      return next(); //authorized user
    } else {
      const err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticated', 'Basic');
      err.status = 401;
      return next(err);
    }
  } else {
    if (req.signedCookies.user === 'admin') {
      return next();
    } else {
       const err = new Error('You are not authenticated!');
       res.status = 401;
       return next(err);
    }
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
