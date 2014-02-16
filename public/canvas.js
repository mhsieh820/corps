			var canvas_width = window.innerWidth;
			var canvas_height = window.innerHeight;
			var blueTeamShield = new Sprite('shield.svg', -10, 10, 20, 30);
			var redTeamShield = new Sprite('redShield.svg', 30, 10, 20, 30);
			var messageBox = new Sprite('commentBox.svg', 0, 0, 160, 80);
			var bgSprite = new Sprite('bg.svg', 0, 0, canvas_width, canvas_height);
			var MAX_SPEED = 1;
			var BLUE_TEAM = 0;
			var RED_TEAM = 1;
			var MESSAGE_DECAY = 1000;

			/**
			 * Clamps a number. Based on Zevan's idea: http://actionsnippet.com/?p=475
			 * params: val, min, max
			 * Author: Jakub Korzeniowski
			 * Agency: Softhis
			 * http://www.softhis.com
			 */
			(function(){Math.clamp=function(a,b,c){return Math.max(b,Math.min(c,a));}})();


			// Add new players into game
		    socket.on('sendPlayer', function (response) {
			    // uid, timestamp, message, team
			    console.log(response);

			    // Check for existing player
			    var newPlayer = true;
			    console.log(game.players);
			    for (var i in game.players) {
			    	console.log("ME" + game.players[i]);
			    	console.log(response.uid);
			    	if (game.players[i].id == response.uid) {
			    		// Found player. Send message
			    		game.players[i].sendMessage(response.message);
			    		newPlayer = false;
			    		break;
			    	}
			    }

			  	// Nobody found. Let's add them!
		    	if (newPlayer) {
		    		game.players.push(new Player(response.uid, response.team));
		    		//console.log("Added new player: " + response.uid);
		    	}

		    });


	        socket.on('ready', function (data) {
		    	socket.emit('gameEngine', "send")
				alert(data);
		    });

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


			var game = {
				interval: 0,
				time: 0,
				fps: 30,
				players: [],
				start: function() {

					// Start code here
					this.interval = setInterval(function() {
						game.update();
						game.draw();
					}, 1000/this.fps);
				},
				stop: function() {
					clearInterval(this.interval);
				},
				update: function() {
					// Update code here
					this.players.forEach(function (player) {
						player.update();
					})
				},
				draw: function() {
					// Draw everything on screen
			        context.clearRect(0, 0, myCanvas.width, myCanvas.height);
			        bgSprite.draw();
					this.players.forEach(function(player) {
						//console.log(player);
						context.save();
						context.translate(player.x, player.y);
						player.draw();
						context.restore();
					});
					// console.log(this.players);
					// for (player in this.players)
					// {
					// 	//player.draw();
					// 	console.log(player);
					// }


				},
				initialize: function() {
					// var emails = ["andre@andrele.com", "pavels@yorku.ca", "ramya.r2cm@gmail.com", "mhsieh820@gmail.com"];
					// var randomEmail = Math.floor(Math.random() * emails.length);
					// var randomTeam = Math.floor(Math.random() * 2);
	    // 			var me = new Player(md5(emails[randomEmail]), randomTeam);
					// this.players.push(me);
					this.start();
				}
			};

			// Sprite constructor
			function Sprite(filename, xoffset, yoffset, width, height) {function doSomething() {}
				var that = this;
				this.loaded = false;
				this.img = new Image();
				this.img.onload = function() {
					that.loaded = true;
				}
				this.img.src = filename;
				this.xoffset = xoffset;
				this.yoffset = yoffset;
				this.width = width;
				this.height = height;
			}

			Sprite.prototype.draw = function() {
				if (this.loaded)
					context.drawImage(this.img, this.xoffset, this.yoffset, this.width, this.height);
			}

			// Player constructor
			function Player(id, team) {
				var that = this;
				this.id = id;
				this.gLoaded = false;
				this.img = new Image();
				this.width = 40;
				this.height = 40;
				this.vx = (Math.random() -.5) * MAX_SPEED;
				this.vy = (Math.random() -.5) * MAX_SPEED;
				this.message = {};
				var randomX = -1;
				if (team <= BLUE_TEAM) {
					this.shield = blueTeamShield;
					randomX = Math.random() * (canvas_width/2 - this.width) + canvas_width/2;
				} else {
					this.shield = redTeamShield;
					randomX = Math.random() * (canvas_width/2-this.width);
				}
				this.x = randomX;
				// this.shield.xoffset = this.width/2;
				// this.shield.yoffset = this.height/2;

      	        this.img.onload = function() {
      	        	that.gLoaded = true;
      	        	context.drawImage(that.img, 0, 0, that.width, that.height);
			    };
			    this.img.src = 'http://www.gravatar.com/avatar/' + id;

				this.team = team;
				this.y = Math.random() * (canvas_height*.75 - this.height) + canvas_height*.25;
				// newPlayer.shield = this.getShield();
			};

			Player.prototype.sendMessage = function(message) {
				console.log("User: " + this.id + " Message: " + message);
				context.font = "30px Arial";
				this.message = {"message": message, "timer": MESSAGE_DECAY};
			}

			Player.prototype.draw = function() {
				//console.log("DRAW MOTHERUFKCER");
				if (this.gLoaded) {
					context.save();
					context.globalAlpha = 0.2;
					context.restore();
					context.drawImage(messageBox.img, (-messageBox.width/2)+(this.width/2), -messageBox.height-10, messageBox.width, messageBox.height);
					context.drawImage(this.img, 0, 0, this.width, this.height);
					this.shield.draw();
					context.fillStyle = 'white';
					context.fillText(this.message, -10, -messageBox.height/2);
				}

			};

			Player.prototype.update = function() {
				// Move players by velocity
				this.x += this.vx;
				this.y += this.vy;

				// Make sure you you haven't gone past the boundaries
				switch (this.team) {
					case (BLUE_TEAM):
					if (this.x < canvas_width/2 || this.x > canvas_width-this.width) {
						this.vx = this.vx * -1;
						this.x = Math.clamp(this.x,canvas_width/2,canvas_width-this.width);
					}
					if (this.y < canvas_height*.25 || this.y > canvas_height-this.height) {
						this.vy = this.vy * -1;
						this.y = Math.clamp(this.y,canvas_height*.25,canvas_height-this.height);
					}
					break;

					case (RED_TEAM):
					if (this.x < 0 || this.x > canvas_width/2-this.width) {
						this.vx = this.vx * -1;
						this.x = Math.clamp(this.x,0,canvas_width/2-this.width);
					}
					if (this.y < canvas_height*.25 || this.y > canvas_height-this.height) {
						this.vy = this.vy * -1;
						this.y = Math.clamp(this.y,canvas_height*.25,canvas_height-this.height);
					}
					break;

					default:
					break;
				}

				// Detect edges and bouce players depending on team
			}

			Player.prototype.getShield = function(team) {
					var that = this;
					var newShield = new Image();
					newShield.src = './shield.svg';
					newShield.onload = function() {
						that.shield = newShield;
					}
			};

			// Setup a canvas element
			var myCanvas = document.createElement('canvas');
			myCanvas.setAttribute("id", "myCanvas");
			myCanvas.width = canvas_width;
			myCanvas.height = canvas_height;

			// Add canvas to DOM

		    var context = myCanvas.getContext('2d');

	    	// Run this when the page loads
		    $j(document).ready(function () {
		    	$j('body').append(myCanvas);
		    	game.initialize();
		    });