var sio = require('socket.io');

module.exports.listen = function(server){
	var io = sio.listen(server);
	io.sockets.on('connection', function(socket){
		socket.on('fileUpload', function(){
			console.log('uploaded');
			socket.emit('recieved');
		});
	});
}