$j = jQuery.noConflict();
var socket = io.connect('/');
$j(document).ready(function () {

$j('#join').click(function(){
	socket.emit('newEmail',{email:$j('#email').val(),choice:$j('#choice').val(),msg:$j('#msg').val()});
	});

});