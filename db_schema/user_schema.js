var mongoose = require('mongoose');

var user_Schema = new mongoose.Schema({
	local:{
		_id: {type: Number, unique:true},
		username: {type:String, unique:true},
		password: String
	},
	facebook:{
		id           : String,
        token        : String,
        email        : String,
        name         : String
	},
	google:{
		id           : String,
        token        : String,
        email        : String,
        name         : String
	}
},{collection:'reg_users'});

module.exports = mongoose.model('reg_users', user_Schema);