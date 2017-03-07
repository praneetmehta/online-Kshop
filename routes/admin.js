var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var router = express.Router();

var file = require('../db_schema/upload_details.js');
router.get('/', function(req, res){
	res.render('admin');
});

router.get('/download', function(req, res) { // create download route
    
  	if(req.session.admintoken){
    //   var path=require('path'); // get path
    // var dir=path.resolve(".")+'/upload/'; // give path
    // fs.readdir(dir, function(err, list) { // read directory return  error or list
    //   if (err) return res.json(err);
    //   else{
    //     res.render('download',{
    //       list:list
    //     });
    //   }   
    // });

    //find files from database that are not yet processed/downloaded/printed
    var unattended = 0;
    var downloaded = 0;
    file.find({status:1}).count(function(err, count){
      unattended = count;
    });
    file.find({status:2}).count(function(err, count){
      downloaded = count;
    });
    file.find({status:{$lt: 3, $gt:0}}).exec(function(err, files){
      if(err) throw err;
      else{res.render('download', {
              files:files,
              unattended:unattended,
              downloaded:downloaded
            });
          }
      });
  }else{
    res.writeHead(200, {
            'Content-Type': 'text/html'
        })
        res.end(['This region is restricted!! Turn around or you will be prosecuted',
            '<a href="/users/home">Go Back </a>'
            
        ].join(''));
  }
});
router.get('/downloadfile',function(req, res, next){
	var newFile = req.query.file;
  var username = req.query.name;
  file.findOne({filename: newFile, username:username, status:1}, function(err, file){
    if(!newFile){console.log("The file could not be loaded!!")}
    else{
      file.status = 2;
      file.save(function(err, updatedFile){
        if(err) throw err;
        else{console.log('The status of the file '+ file.filename + ' has been changed to downloaded')}
      });
    }
  })
	console.log(newFile);
  console.log(username);
    var destination = path.resolve(".")+'/upload/'+newFile;
	res.download(destination, function(err){
		if(err) throw err;

    //delete file after download ** need to do this after socket emit of file print complete **

		// else{
		// 	fs.unlink('./upload/'+newFile, function (err) {
		// 	deleted = true;
        //  if (err) throw err;
        //  console.log('successfully deleted ' + newFile);
        // });
		// }
	});
});
router.get('/statuschange', function(req, res){
  var id = req.query.id;
  file.findOne({_id: id, status:{$lt: 3, $gt:0}}).exec(function(err, file){
    status = file.status;
    file.status = status+1;
    file.save(function(err, savedfile){
      if(err) throw err;
      else{
        console.log('status of ' + savedfile.filename + 'changed to '+ savedfile.status);
        res.writeHead(200, {'content-type': 'text/html'});
        res.write('<script>window.close();</script>');
        res.end();
        // if(savedfile.status >=3){
        //   fs.unlink('./upload/'+ savedfile.filename, function (err) {
        //      
        //        if (err) throw err;
        //        console.log('successfully deleted ' + savedfile.filename);
        //  });
        // }
      }
    });
  });
});

router.get('/dispatchStatus', function(req, res){
	if(req.session.admintoken){
		
		file.find({dispatch:false, status:{$gt:2}}).exec(function(err, files){
			if(err) throw err;
			else{
				res.render('details',{
					files:files,
					
				});
			}
		});
	}else{
		 res.writeHead(200, {
            'Content-Type': 'text/html'
        })
        res.end(['This region is restricted!! Turn around or you will be executed',
            '<a href="/users/home">Go Back </a>'
            
        ].join(''));
  }		
});

router.get('/changedispatchstatus', function(req, res){
	var id = req.query.id;
	var name = req.query.name;
	file.findOne({_id:id, dispatch:false, status:{$gt:2}}).exec(function(err, file){
		if(file){
			file.dispatch = true;
			file.save(function(err, savedstate){
			if(err) throw err;
			else{
				console.log(file.filename + 'belonging to '+ file.username + ' has been successfully dispatched');
				res.redirect('/admin/dispatchStatus');
			}
		});
		}else{
			console.log('no such user or file found!!' + filename + name);
			
		}
	});
});

router.get('/modifycash', function(req, res){
	var newcash = req.query.cost;
	console.log(newcash);
	var id = req.query.id;
	console.log(id);
	file.findOne({_id:id, dispatch:false, status:3}).exec(function(err, file){
		if(file){
			if(err) throw err;
		else{
			file.cost = newcash;
			file.save(function(err, save){
			if (err) throw err;
			else{
				res.redirect('/admin/dispatchStatus');
			}
		});
		}
	}else{
		console.log('no file to modify!!');
	}
	});
});
module.exports = router;