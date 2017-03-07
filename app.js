var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var socket = require('socket.io');
var MongoStore = require('connect-mongodb-session')(session);
var passport = require('passport');
var flash = require('express-flash');

var routes = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
require('./config/passport.js')(passport);
var app = express();

var store = new MongoStore({
    uri: 'mongodb://localhost/karaturi',
    collection: 'session'
});

store.on('connect', function() {
    console.log('Store is ready to use')
});

store.on('error', function(err) {
    console.log('Store could not initialize', err)
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'adf547a6sd7gad46asdf5a1sd676a541a',
    resava: true,
    saveUninitialized: true,
    store: store
}));
require('./config/auth.js');
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use('/', routes);
app.use('/users', users);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
