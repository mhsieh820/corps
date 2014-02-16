		    $j = jQuery.noConflict();

			var socket = io.connect('/');
			var gameDuration = 25;

			var canvas_width = window.innerWidth;
			var canvas_height = window.innerHeight;
			var blueTeamShield = new Sprite('shield.svg', -10, 10, 20, 30);
			var redTeamShield = new Sprite('redShield.svg', 30, 10, 20, 30);
			var messageBox = new Sprite('commentBox.svg', 0, 0, 160, 80);
			var bgSprite = new Sprite('bg.svg', 0, 0, canvas_width, canvas_height);
			var feet = new Sprite('feet.svg', 0, 0, 20, 30);

			var catapultBody = new Sprite('image/catapultBody.svg', .20 * canvas_width, 300, 124, 72);
			var catapultArm = new Sprite('image/catapultArm.svg', 0 , 0, 168, 23);
			
			var catapultBody2 = new Sprite('image/catapultBody_rev.svg', .70 * canvas_width, 300, 124, 72);
			var catapultArm2 = new Sprite('image/catapultArm_rev.svg', 0 , 0, 168, 23);
			
			var bomb = new Sprite('image/bomb.svg', -200, -190, 142, 179);
			var rock1 = new Sprite('image/bomb-rock.svg', -200, -190, 142, 179);
			var paper1 = new Sprite('image/bomb-paper.svg', -200, -190, 142, 179);
			var scissor1 = new Sprite('image/bomb-scissors.svg', -200, -190, 142, 179);
			
			var bomb2 = new Sprite('image/bomb.svg', 55, -168, 142, 179);
			var rock2 = new Sprite('image/bomb-rock.svg', 55, -168, 142, 179);
			var paper2 = new Sprite('image/bomb-paper.svg', 55, -168, 142, 179);
			var scissor2 = new Sprite('image/bomb-scissors.svg', 55, -168, 142, 179);

			var logo = new Sprite('image/logo.png', 0, 0, 348, 206);
			
			var MAX_SPEED = 1;
			var BLUE_TEAM = 0;
			var RED_TEAM = 1;
			var MESSAGE_DECAY = 90;
			var startAngle = 260;
			var endAngle = 180;
			var finalAngle = 280;
			
			var startAngle2 = -90;
			var endAngle2 = -10;
			var finalAngle2 = 100;
			
			var rateOfChange = 80/(30*gameDuration);
			var rateOfFinalChange = 10;
			
			var percentage = 1;
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
			    // uid, timestamp, message, team, choice[r,p,s]
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
		    		var newPlayer = new Player(response.uid, response.team);
		    		game.players.push(newPlayer);
		    		newPlayer.sendMessage(response.message);
		    		//console.log("Added new player: " + response.uid);
		    	}

		    });


	        socket.on('ready', function (data) {
		    	socket.emit('gameEngine', "send")
				// alert(data);
		    });


		    socket.on('sendWinner' , function (data) 			{
		    	// Team A, Team B, TIE!
		    	console.log("Winner: " + data);
		    	game.finishAnimation(data.winner);

		    	//totals
		    	var totalA = data.statA.r + data.statA.p + data.statA.s;
		    	var totalB = data.statB.r + data.statB.p + data.statB.s;
		    	console.log(totalA);
		    	console.log(totalB);

		    	var html = "";
		    	$j.each(data.statA, function (key, value) {
		    		console.log("Key: " + key + " Value: " + value);

		    		html+= "<div class='chartContainer' style='float:left'><div class='chart percentage easyPieChart' data-percent='"+value/totalA*100+"' style='width: 110px; height: 110px; line-height: 110px;'><span>"+Math.floor(value/totalA*100)+"</span>%</div>";
		    		if (key == "r") {
		    			html += "<div class='label'>Rock</div></div>";
		    		} else if (key == "p") {
		    			html += "<div class='label'>Paper</div></div>";
		    		} else {
		    			html += "<div class='label'>Scissors</div></div>";
		    		}
			    	//html += "<div class='large-2 columns'><span class='count'>" + value + "</span></div>";
		    	});
		    		html += "<span class=''>RED</span>";


		    	$j.each(data.statB, function (key, value) {
		    		if (key == "r")
			    		html+= "<div class='chartContainer' style='float:left; clear:both'><div class='chart percentage easyPieChart' data-percent='"+value/totalB*100+"' style='width: 110px; height: 110px; line-height: 110px;'><span>"+Math.floor(value/totalB*100)+"</span>%</div>";
			    	else
				    	html+= "<div class='chartContainer' style='float:left'><div class='chart percentage easyPieChart' data-percent='"+value/totalB*100+"' style='width: 110px; height: 110px; line-height: 110px;'><span>"+Math.floor(value/totalB*100)+"</span>%</div>";
		    		if (key == "r") {
		    			html += "<div class='label'>Rock</div></div>";
		    		} else if (key == "p") {
		    			html += "<div class='label'>Paper</div></div>";
		    		} else {
		    			html += "<div class='label'>Scissors</div></div>";
		    		}
		    	});

		    		html += "<span class=''>BLUE</span>";

		    	$j("#text").html("<h1>" + data.winner + "</h1><div class='row' >" + html + "</div>");

			    $j('.chart').easyPieChart({
			        //your configuration goes here
			    });

		    	$j("#splash").delay( 2000 ).fadeIn();
		    	game.ended = true;
		    });

		    socket.on('updateScore', function(response) {
			    // $j("#scoreA").text(response.teamA);
			    // $j("#scoreB").text(response.teamB);
			    game.team1 = response.teamA;
			    game.team2 = response.teamB;
			    console.log("[SCORE] Team1: " + response.teamA + " Team2: " + response.teamB);
			   //teamA, teamB
		    });


			var game = {
				interval: 0,
				time: 0,
				fps: 30,
				players: [],
				currentAngle: startAngle,
				currentAngle2: startAngle2,
				team1: "",
				team2: "",
				running: false,
				ended: false,
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
				finishAnimation: function(winner) {
					// Team A, Team B, TIE!
					if (winner == "Team Red Wins!") {
						this.players.forEach(function(player) {
							//console.log(player);
							player.vx = 15;
						});
					} else if (winner == "Team Blue Wins!") {
						this.players.forEach(function(player) {
							//console.log(player);
							player.vx = -15;
						});
					} else {
						this.players.forEach(function(player) {
							//console.log(player);
							if (player.team == 0) {
								player.vx = -15;
							} else {
								player.vx = 15;
							}
						});
					}
					game.running = false;
					window.cheer.play();

				},
				draw: function() {
					// Draw everything on screen
			        context.clearRect(0, 0, myCanvas.width, myCanvas.height);
			        bgSprite.draw();
			        context.save();
			        context.translate(myCanvas.width/2-(348/2), 50);
		        	logo.draw();
			        context.restore();
					context.save();
					if (game.currentAngle > endAngle && game.running)
					{
						//console.log(game.time);
						angle = game.currentAngle - rateOfChange;
						game.currentAngle = angle;
					} else if (game.currentAngle < startAngle && game.ended) {
						angle = game.currentAngle + rateOfFinalChange;
						game.currentAngle = angle;
					} else if (game.currentAngle >= startAngle && game.ended) {
						var speed = 10;
						bomb.yoffset -= speed;
						bomb.xoffset += speed*.1;
						rock1.yoffset -= speed;
						rock1.xoffset += speed*.1;
						paper1.yoffset -= speed;
						paper1.xoffset += speed*.1;
						scissor1.yoffset -= speed;
						scissor1.xoffset += speed*.1;

					}
					game.drawCatapult(game.currentAngle);
					context.restore();
					context.save();
					
					if (game.currentAngle2 < endAngle2 && game.running)
					{
						//console.log(game.time);
						angle2 = game.currentAngle2 + rateOfChange;
						game.currentAngle2 = angle2;
					} else if (game.currentAngle2 > startAngle2 && game.ended) {
						angle = game.currentAngle2 - rateOfFinalChange;
						game.currentAngle2 = angle;
					} else if (game.currentAngle >= startAngle2 && game.ended) {
						var speed = 10;
						bomb2.yoffset -= speed;
						bomb2.xoffset -= speed*.1;
						rock2.yoffset -= speed;
						rock2.xoffset -= speed*.1;
						paper2.yoffset -= speed;
						paper2.xoffset -= speed*.1;
						scissor2.yoffset -= speed;
						scissor2.xoffset -= speed*.1;

					}
					game.drawCatapult2(game.currentAngle2);
					context.restore();
					//timer
					
					if (game.running)
					{
						//change percentage
						percentage = game.time/gameDuration;
					}
					
					game.drawTimer(percentage);


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
				drawCatapult: function (angle) {
				
					context.save();
					// Move to origin point
					context.translate(.20 * canvas_width + 80,350);

					// Rotate into angle state
					var rads = angle * (Math.PI / 180);
					context.rotate(rads);
					context.save();
					// Start rock translation

					// context.translate(.20 * canvas_width + 80,350);

					// offset_x = -168;
					// offset_y = -160;

					bomb_x = 0;
					bomb_y = 0;
					//bomb_x = Math.cos((angle) * (Math.PI / 180)) * 128;
					//bomb_y = Math.sin((angle) * (Math.PI / 180)) * 128;

					// context.translate(bomb_x + offset_x, bomb_y + offset_y);
					// Rotate the bomb around
					context.rotate(Math.PI);
					if (game.team1 == "r") {
						rock1.draw();
					} else if (game.team1 == "p") {
						paper1.draw();
					} else if (game.team1 == "s") {
						scissor1.draw();
					} else {
						bomb.draw();
					}

					context.restore();
					catapultArm.draw();
					context.restore();
					catapultBody.draw();

				},
				drawCatapult2: function (angle) {

					context.save();
					// Set origin
					context.translate(.70 * canvas_width + 38,345);
					// Convert to radians
					var rads = angle * (Math.PI / 180);

					context.rotate(rads);
					context.save();

					if (game.team2 == "r") {
						rock2.draw();
					} else if (game.team2 == "p") {
						paper2.draw();
					} else if (game.team2 == "s") {
						scissor2.draw();
					} else {
						bomb2.draw();
					}					
					context.restore();
					catapultArm2.draw();
					context.restore();
					catapultBody2.draw();

				},
				drawTimer: function(percentage) {
					context.save();
					context.translate(myCanvas.width/2, myCanvas.height*0.9);
					context.fillStyle = '#ba002c';
					context.fillRect(0,0, myCanvas.width/2*percentage, 30);
					context.fillRect(0,0, -myCanvas.width/2*percentage, 30);
					context.restore();
				},
				initialize: function() {
					// for (var i = 0; i < 2; i++) {
					// 	var randomVote = Math.floor(Math.random() * 3 + 1);
					// 	var vote = "";
					// 	switch (randomVote) {
					// 		case 1:
					// 		vote = "r";
					// 		break;
					// 		case 2:
					// 		vote = "p";
					// 		break;
					// 		case 3:
					// 		vote = "s";
					// 		break;
					// 	}

					// 	if (i == 1) {
					// 		game.team1 = vote;
					// 	} else {
					// 		game.team2 = vote;
					// 	}
					// }


					// for (var i = 0; i < 200; i++){
					// 	var emails = ["andre@andrele.com", "pavels@yorku.ca", "ramya.r2cm@gmail.com", "mhsieh820@gmail.com"];
					// 	var randomEmail = Math.floor(Math.random() * emails.length);
					// 	var randomTeam = Math.floor(Math.random() * 2);
		   //  			var me = new Player(md5(emails[randomEmail]), randomTeam);
					// 	this.players.push(me);
					// }

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
				this.choice = "";
				this.width = 40;
				this.height = 40;
				this.vx = (Math.random() -.5) * MAX_SPEED;
				this.vy = (Math.random() -.5) * MAX_SPEED;
				this.message = "";
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
				context.font = "16px Arial";
				this.message = {"message": message, "timer": MESSAGE_DECAY};
			}

			Player.prototype.draw = function() {
				//console.log("DRAW MOTHERUFKCER");
				if (this.gLoaded) {
					// Draw text messages
					if (this.message.timer > 0) {
						// context.drawImage(messageBox.img, (-messageBox.width/2)+(this.width/2), -messageBox.height-10, messageBox.width, messageBox.height);
						context.save();
						var truncatedMessage = this.message.message.substring(0,21);
						var textWidth =  context.measureText(truncatedMessage).width;
						context.translate(0,-15);
						context.fillStyle = 'black';
						context.save();
						context.globalAlpha = 0.4;
						context.fillRect((-(textWidth+20)/2)+(this.width/2), -20, textWidth+20, 30);
						context.restore();
						context.fillStyle = 'white';
						context.fillText(truncatedMessage, (-(textWidth+20)/2)+(this.width/2)+10, 0);
						context.restore();
					}
					// Draw feet
					context.drawImage(feet.img, 7, this.height);

					// Draw gravatar
					context.drawImage(this.img, 0, 0, this.width, this.height);
					// Draw player shield
					this.shield.draw();

				}

			};

			Player.prototype.update = function() {
				if (this.message.timer > 0)
					this.message.timer = this.message.timer -1;

				// Move players by velocity
				this.x += this.vx;
				this.y += this.vy;

				if (!game.ended) {
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
				}

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
				function loadSound (src) {
				    var sound = document.createElement("audio");
				    if ("src" in sound) {
				        sound.autoPlay = false;
				    }
				    else {
				        sound = document.createElement("bgsound");
				        sound.volume = -10000;
				        sound.play = function () {
				            this.src = src;
				            this.volume = 0;
				        }
				    }
				    sound.src = src;
				    document.body.appendChild(sound);
				    return sound;
				}
	 
				window.theme = loadSound("sound/theme song 2.mp3");  //  preload
				window.theme.volume = 0.5;
				window.theme.play();

				window.catapult = loadSound("sound/catapult.mp3");
				window.cheer = loadSound("sound/cheer.mp3");

				window.explosion = loadSound("sound/splosion.mp3");
				 
				function playmusic() {
					 if(theme.paused){
						theme.play(); 
						console.log("Wasn't playing");
					 }
					 else {
						console.log("Was playing");
						 theme.pause();
					 }
				}
		    	$j('body').append(myCanvas);

		    	game.initialize();

		    	$j("#start").on("click", function () {
					$j("#splash").fadeOut();
					socket.emit('gameStart',true);
					countDown(gameDuration,function(){ socket.emit('gameEnd', true); console.log("Game Ended"); });
					game.running = true;
				});

		    });
		    
		   


	var countDown = function (counter, callback) {
            var timer = setInterval(countItDown,1000);

            // Decrement the displayed timer value on each 'tick'
            function countItDown(){
                counter -= 1;
                game.time = counter;
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