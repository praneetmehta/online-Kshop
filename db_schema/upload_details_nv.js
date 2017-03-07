var mongoose = require('mongoose');

var upload_schema = new mongoose.Schema({
	username: String,
	filename: String,
	status: {type: Number, default: 1},
	details:{
		color:{type:String, default:'B&W'},
		pages:{type:String, default:'1-1'},
		copies:{type:Number, default:1}
	},
	dispatch:{type:Boolean, default:false},
	cost:{type:Number, default:0}
	
},{timestamps : true},{collection:'uploads'});

module.exports = mongoose.model('uploads', upload_schema);