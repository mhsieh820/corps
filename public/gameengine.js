$j = jQuery.noConflict();

var socket = io.connect('/');
var users = {};

window.onload = function() {
 	

    //console.log('Game engine')
    socket.on('ready', function (data) {
    	socket.emit('gameEngine', {})
    });
    
}	
    
    socket.on('emailReceived', function (data){
    	console.log('email received');
    	
    });   
    
    socket.on('gameTime', function (value) {
	    
	    // 1 (start), -1 (end)
	    
    });
    
    socket.on('updateScore', function(response) { 
	    $j("#scoreA").text(response.teamA);
	    $j("#scoreB").text(response.teamB);
	   //teamA, teamB 
    });
    

	socket.on('gameStart',function(gameDuration){
		countDown(gameDuration,function(){ socket.emit('gameEnd',{}) });		
	});


	function countDown(counter, callback) {
            var timer = setInterval(countItDown,1000);

            // Decrement the displayed timer value on each 'tick'
            function countItDown(){
                counter -= 1;
                console.log('time:'+counter+'\n');
         
                if( counter <= 0 ){
                    console.log('Countdown Finished.');
                    // Stop the timer and do the callback.
                    clearInterval(timer);
                    callback();
                    return;
                }
            }

    };

    // socket.on('sendPlayer', function (response) {
	   //  // uid, timestamp, message, team
	   //  console.log(response);
	   //  if (response.team == 0)
	   //  {
		  //   //teamA
		  //   $j("#teamA").append("<div>" + response.uid + " " + response.timestamp + " Message:  " + response.message + "</div>");
	   //  }
	   //  else
	   //  {
		  //   //teamB
		  //   $j("#teamB").append("<div>" + response.uid + " " + response.timestamp + " Message:  " + response.message + "</div>");
	   //  }
    // });

 
