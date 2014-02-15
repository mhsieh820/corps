var express = require('express');
var sendgrid = require('sendgrid');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
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
var gameEngine = 0;
io.sockets.on('connection', function (socket) {
  
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
  	console.log(data);
  	io.sockets.socket(gameEngine).emit('emailReceived',data);

    });
    
    
    //SOCKETS THAT COME IN FROM EMAIL
    
    //email
    
    //game ends
    
    

	//game engine
	function Game(socket) {
		
		//list of players
		this.players = [];
		this.score = {};
		this.socket = socket;
	}
	
	Game.prototype.updateScore = function(choice) {
		
		//need get old choice
		
		
		//set new choice
		
		
		//update score
		
	}
	
	Game.prototype.startGame = function () {
		
		//send to client to start the game
		
	};
	
	
	//score is sent when the top choice changes
	Game.prototype.sendScore = function () {
		
		
	};
	
	Game.prototype.sendPlayer = function () {
		
		//send to client everything
		//email hash
		//timestamp
		//message if exists
		//team
			
		
		
	}
	
	
	function Player() {
		
		this.email = "";
		this.choice = "";
		this.team = "";
		this.uid = "";
		
	}
	
	Player.prototype.hashEmail = function(email) {
		
		//hash the email MD5 to uid
		
	}
	
	Player.prototype.updateChoice = 		function(choice) {
		this.choice = choice;
	}
	
	
	Player.prototype.setTeam = function (count) {
		
		//choose team A or B
		
	}
	
	
	
  

});
