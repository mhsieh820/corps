// window.onload = function() {
// console.log('TestUser.js');
// $('#join').click(function(){
// 	console.log('Join Clicd');

// 	socket.emit('newEmail',{email:$('#email').val(),choice:$('#choice').val(),msg:$('#msg').val()});
// 	});
// }

var socket = io.connect('www.corpsgame.com:3000');
window.onload = function(){

$('#join').click(function(){
	console.log('Join Clicked');
	socket.emit('newEmail',{email:$('#email').val(),choice:$('#choice').val(),msg:$('#msg').val()});
	});

}