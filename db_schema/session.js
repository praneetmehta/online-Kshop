var mongoose = require('mongoose');

var session_schema = new mongoose.Schema({
	session: {
      lastAccess: {type: Date, default:Date.now()},
      cookie: {
        originalMaxAge: Date,
        expires: Date,
        httpOnly: Boolean,
        path: String
      },
      "_csrf": String
    },
    expires: Date
	},{collection: 'session'});

module.exports = mongoose.model('session', session_schema);