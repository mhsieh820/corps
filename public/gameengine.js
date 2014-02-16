$j = jQuery.noConflict();

var socket = io.connect('/');
var gameDuration = 10;

$j(document).ready(function () {
	
	$j("#start").on("click", function () {
	
		$j("#splash").fadeOut();
		socket.emit('gameStart',true);
		countDown(gameDuration,function(){ socket.emit('gameEnd', true) });
	});
	
});
    

	var countDown = function (counter, callback) {
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