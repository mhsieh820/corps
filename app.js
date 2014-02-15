var express = require('express');
var sendgrid = require('sendgrid');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var md5 = require("./md5.min.js");
//var game = require("./gamecenter.js");
io.set("log level", 1);
server.listen(process.env.PORT || 5000);
// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
//app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index());
app.get('/client', routes.client());

var count = 0;

io.sockets.on('connection', function (socket) {
  
  	game = new Game(socket);
  	//connect game
  	socket.emit('ready','Ready!');
  	socket.on('gameEngine', function(data){
    	gameEngine = socket.id;
    	console.log(gameEngine);
    	io.sockets.socket(gameEngine).emit('register','REGISTER?');
    });

  	
  //	console.log('emited ready');  	
  
  	//New Email Recieved
  	socket.on('newEmail',function (data) {
  		console.log('email received'+data.email+data.msg+data.choice);
  		var player=game.updatePlayer(data,count);
  		game.sendPlayer(player,data.message);

    });
    
     //SOCKETS THAT COME IN FROM EMAIL
   
    
    //email
    
    //game ends
    
    

	//game engine
	function Game(socket) {
		
		//list of players
		this.players = [];
		this.scoreA = {r:"0",p:"0",s:"0"};
		this.scoreB = {r:"0",p:"0",s:"0"};
		this.socket = socket;
		this.count=0;

	}

	Game.prototype.updatePlayer = function(data,count) {
		var hash=md5.md5(data.email);
		console.log('hash'+hash);
		//if player exists, update score and send player to client
		for(var i=0;i< this.players.length;i++){
			if( hash == this.players[i].uid){
				console.log('plaey at position'+i);
				var oldChoice= this.players[i].choice;
				var newChoice= this.players[i].updateChoice(data.choice);
				if(newChoice!=null){
					game.updateScore(oldChoice, newChoice, this.players[i].team);
				}
				else{
					this.players[i].choice=oldChoice;
				}
				break;
				}
		}
		//if player doesn't exist, create new player	
				if(i==this.players.length){
					console.log('Creating new player');
					this.players[i]= new Player(this.hash, data.email,data.choice,++count);
					this.players[i].updateChoice(this.players[i].choice);
					this.updateScore('null',this.players[i].choice ,this.players[i].team);
				}

	}
	

	Game.prototype.updateScore = function(oldChoice,newChoice,team) {
		if(team==1){
			score = this.scoreA;
		}
		else{
			score = this.scoreB;
		}
		
		//need get old choice
		
		switch (oldChoice){
			case 'r': score.r--;
						break;
			case 'p': score.p--;
						break;
			case 's': score.s--;
						break;
			default: break;
		}
		switch (newChoice){
			case 'r': score.r++;
						break;
			case 'p': score.p++;
						break;
			case 's': score.s++;
						break;
			default: break;
		}
		console.log('score r:'+score.r+ 'p: '+score.p+'s: '+score.s);
		
	}
	

	Game.prototype.startGame = function () {
		
		//send to client to start the game
		io.sockets.socket(gameEngine).emit('gameTime', '1');
		//start countdonw
		
		this.countDown(20, function () {
			io.sockets.socket(gameEngine).emit('gameTime', '-1');
		});
		//end game
	};
	
	
	//score is sent when the top choice changes
	Game.prototype.sendScore = function (team) {
	
	
		//team = 0,1 choice = r,p,s
		var response = { team: team, choice: choice };
		io.sockets.socket(gameEngine).emit('updateScore', response);
	};
	
	
	//this is sent every time a new email comes in
	Game.prototype.sendPlayer = function (player, message) {
		
		//send to client everything
		//email hash
		//timestamp
		//message if exists
		//team

		//get current timestamp
		var timestamp = new Date().getTime();	
		
		//player is the Player object
		var response = { uid: player.uid, timestamp: timestamp, message: message, team: player.team };
		
			
		io.sockets.socket(gameEngine).emit('sendGame',response);
	
	};
	
	Game.prototype.countDown = function (startTime, callback) {
            var timer = setInterval(countItDown,1000);

            // Decrement the displayed timer value on each 'tick'
            function countItDown(){
                startTime -= 1;
                

                if( startTime <= 0 ){
                    // console.log('Countdown Finished.');

                    // Stop the timer and do the callback.
                    clearInterval(timer);
                    callback();
                    return;
                }
            }

    };
			
	
//utility for timer	
	
	
	
	function Player(hash,email,choice,count) {
		this.email = email;
		this.choice = choice;
		this.team = this.setTeam(count);
		this.uid = hash;
	};
	
	
	Player.prototype.hashEmail = function(email) {
		
		//hash the email MD5 to uid
		this.uid = md5.md5(email);
		
	};
	
	Player.prototype.updateChoice = function(choice) {
		
		//take input and normalize
		var string = choice.trim().charAt(0).toLowerCase();;
		if (string == 'r' || string == 'p' || string == 's')
		{
			this.choice = string;
		}
		console.log('New Choice:'+string);
	};
	
	
	Player.prototype.setTeam = function (count) {
		
		//choose team A or B
		if (count % 2 == 0)
		{
			this.team = 0; //TEAM A
		}
		else
		{
			this.team = 1; //TEAM B
		}
		console.log('player assigned team:'+this.team);
	};
	
	
	
  

});
