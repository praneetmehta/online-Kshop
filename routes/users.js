var express = require('express');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var passport = require('passport');
var user = require('../db_schema/user_schema');
var session = require('../db_schema/session');
var router = express.Router();
var file = require('../db_schema/upload_details.js');
require('../config/passport')(passport);

mongoose.connect('mongodb://localhost/karaturi');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//get request display signup page
router.get('/signup', function(req, res) {
    res.render('signup');
});

//get request to display login page
router.get('/login', function(req, res) {
    res.render('login');
});

//post request for registering user
router.post('/signup', function(req, res) {
    var username_format = /(f20)\d{5}/g;
    var username = req.body.username;
    var pwd = req.body.pwd;

    if(username.match(username_format)){
        var newUser = new user();
    newUser.local.username = username;
    newUser.local._id = username.slice(1);
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(pwd, salt);
    newUser.local.password = hash;
    newUser.save(function(err, savedObj) {
        if (err) {
            console.log(err);
            res.redirect('/users/signup');
        } else {

            console.log(username+ ' registered');
            res.redirect('/users/login');

        }
    });
}else{
    res.render('signup');
}

});

//post request to login the registered user 
router.post('/login', function(req, res) {
    var username = req.body.username;
    var pwd = req.body.pwd;

    user.findOne({ 'local.username': username }, function(err, newUser) {
        if (err) {
            console.log(err);
            return res.redirect('/users/login');
        } else if (!newUser) {
            console.log('No such user');
            req.session.destroy();
            return res.redirect('/users/login');
        } else if (newUser) {
            if (username == 'f2000000' && bcrypt.compareSync(pwd, newUser.local.password)) {
                req.session.user = username;
                req.session.admintoken = true;
                console.log('Hey Admin');
                return res.redirect('../admin');
            }else if (bcrypt.compareSync(pwd, newUser.local.password)) {
                req.session.user = username;
                console.log(username + ' logged in successfully');
                return res.redirect('/users/home');
            }
             else {
                console.log('incorrect pwd');
                req.session.destroy();
                return res.redirect('/users/login');
            }
        }
    });
});

//display home for the logged in user
router.get('/home', function(req, res) {
    if (!req.session.user) {
        res.render('try_nonauth');
    } else if (req.session.user) {
        res.redirect('../');
    }
});
//logout the user and destroy the session
router.get('/logout', function(req, res) {
    if (req.session.user) {
        req.session.destroy();
        res.redirect('/users/login');
        console.log('true');
    } else {
        res.redirect('/users/login');
    }
});
router.get('/dashboard', function(req, res){
    file.find({username: req.session.user}).sort('-createdAt').exec(function(err, files){
        if(err) throw err;
        else{
            res.render('dashboard',{
                files: files
            });
        }
    });
});
router.get('/auth/facebook',
  passport.authenticate('facebook',{scope:['email']}));

router.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/users/login' }),
  function(req, res) {
    req.session.user = req.user.facebook.name;
    res.redirect('/');

  });
router.get('/auth/google',
  passport.authenticate('google',{scope:['profile','email']}));

router.get('http://karaturi.ddns.net:3000/users/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/users/login' }),
  function(req, res) {
    console.log('The google user details are: '+req.user);
    req.session.user = req.user.google.name;
    res.redirect('/');

  });
module.exports = router;
