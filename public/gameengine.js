var socket = io.connect('http://localhost:5000');
var users={};

window.onload = function() {
 	
    alert('GAME ENGINE');
    console.log('Game engine')
    socket.on('ready', function (data) {
    	socket.emit('gameEngine',{})
        alert(data);
    });
    socket.on('emailReceived', function (data){
    	console.log('email recieved');
    	alert(data);
    });

    
    
}
 
