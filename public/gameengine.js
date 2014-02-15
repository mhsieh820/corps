$j = jQuery.noConflict();

var socket = io.connect('http://localhost:5000');
var users = {};

window.onload = function() {
 	
    //alert('GAME ENGINE');
    //console.log('Game engine')
    socket.on('ready', function (data) {
    	socket.emit('gameEngine', "send")
		alert(data);
    });
    
}	
    
    socket.on('emailReceived', function (data){
    	console.log('email received');
    	//alert(data);
    });   
    
    socket.on('gameTime', function (value) {
	    
	    // 1 (start), -1 (end)
	    
    });
    
    socket.on('updateScore', function(response) { 
	    $j("#scoreA").text(response.teamA);
	    $j("#scoreB").text(response.teamB);
	   //teamA, teamB 
    });
    
    socket.on('sendPlayer', function (response) {
	    // uid, timestamp, message, team
	    console.log(response);
	    if (response.team == 0)
	    {
		    //teamA
		    $j("#teamA").append("<div>" + response.uid + " " + response.timestamp + " Message:  " + response.message + "</div>");
	    }
	    else
	    {
		    //teamB
		    $j("#teamB").append("<div>" + response.uid + " " + response.timestamp + " Message:  " + response.message + "</div>");
	    }
    });

 
