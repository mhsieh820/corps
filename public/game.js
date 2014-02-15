$j = jQuery.noConflict();


$j(document).ready(function () {
	var socket = io.connect('http://localhost:5000');
	var icon;

	
	socket.on('create_new', function (response) {
		

	});

	//create the game
	$j("#gameHost").on("click", function () {
		
				
	});
	
	
	//join the game, scaffold for the game
	$j("#gameJoin").on("click", function () {
		
		//join a created game
		
		
		
	});


	//team / r or b
	function Andre(response) { 
		this.type = response.type;
		this.id = response.id;
	};
	
	//send message
	Andre.prototype.message = function(content) {
	
	
	
	};
	
	Andre.prototype.draw = function() {
		var div = $j("<div>").addClass("andre").attr("id", this.id);
		if (this.type == 'b') {
			div.addClass("blue");
		}
		else
		{
			div.addClass("red");
		}
		
			return div;
	};	
	
});