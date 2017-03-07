window.onload = function(){
	var socket = io.connect();
	//on file submit
	socket.on('connect', function(){socket.emit('fileUpload');socket.on('recieved', function(){
		console.log('file recieved');
	});})
	// function sendUpdate(){
	// 	socket.emit('fileUpload');
	// }
	// socket.on('recieved', function(){
	// 	console.log('file recieved');
	// })
}