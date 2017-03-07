var express = require('express');
var router = express.Router();
var multer = require('multer');
var crypto = require('crypto');
var mime = require('mime');
var path = require('path');
var fs = require('fs');
//module for opening files on the pc in native apps
var open = require('open');

// import upload details schema
var file = require('../db_schema/upload_details.js');


//multer storage as disk-storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
maxSize = 100000000;
//multer upload file extension filter for spam prevention
var upload = multer({ storage: storage,
  limits: { fileSize: maxSize },
	fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);
    ext = ext.toLowerCase();
    if (ext !== '.pdf' && ext !== '.pptx' && ext !== '.txt' && ext != '.jpg' && ext !== '.jpeg') {
      return cb(null, false)
    }

    cb(null, true)
  }
 	});

/* GET home page. */
router.post('/upload', upload.any(), function(req,res,next){
	console.log(req.files);
  var fileupload = new file();  
  fileupload.username = req.session.user;
  fileupload.filename = req.files[0].originalname;
  fileupload.details.color = req.body.color;
  fileupload.details.pages = req.body.from + '-' + req.body.to;
  fileupload.details.copies = req.body.copies;
  fileupload.dispatch = false;
  fileupload.cost = 0;
  fileupload.save(function(err, savedfile){
    if(err) throw err;
    else{
      console.log(req.files[0].filename + ' uploaded successfully');
    }
  });

	  res.render('view',{file:req.files[0].originalname});
});


router.get('/view', function(req, res){
	fs.readFile('./upload/'+req.query.view , function(err, file) {
      // res.writeHead(200, {"Content-Type" : "application/"+ uploaded_file_mimetype});
      // res.write(file, "binary");
      open('./upload/'+req.query.view);
      res.writeHead(200, {'content-type': 'text/html'});
    	res.write('<a href="/proceed">Proceed</a> <script>window.close();</script>');
    	res.end();
    });
})
/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user == 'f2000000'){
    res.render('admin')
  }
  else if(req.session.user){
  	res.render('try',{
  	user:req.session.user
  });
  }else{
  	 res.render('try_nonauth');
  }
});


router.get('/electronics', function(req, res, next) {
  if(req.session.user){
  	res.render('electronics',{
  	user:req.session.user
  });
  }else{
  	res.writeHead(200, {
            'Content-Type': 'text/html'
        })
        res.end(['OOOPS!! You are not authorized.. Login to view this content!!',
            '<a href="/users/login">Go to the Login Page </a>',
            'or else <a href="/users/register"> Register</a>'
        ].join(''));
  }
});
router.get('/stationery', function(req, res, next) {
  if(req.session.user){
  	res.render('stationery',{
  	user:req.session.user
  });
  }else{
  	res.writeHead(200, {
            'Content-Type': 'text/html'
        })
        res.end(['OOOPS!! You are not authorized.. Login to view this content!!',
            '<a href="/users/login">Go to the Login Page </a>',
            'or else <a href="/users/register"> Register</a>'
        ].join(''));
  }
});

module.exports = router;
