var express = require('express');
var sendgrid  = require('sendgrid')('a', 'corpsgame');
var routes = require('./routes');
var http = require('http');
var fs = require('fs');
var path = require('path');

var app = express();
var server = require('http').createServer(app);

var io = require('socket.io').listen(server);
var md5 = require("./md5.min.js");
//var game = require("./gamecenter.js");


server.listen(process.env.PORT || 80);

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.bodyParser());

//app.use(express.logger('dev'));

//app.use(express.json());
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
var game = new Game();
var gameEngine;
var gameDuration = 180;
var gameOn = true;
var teamChoice = null;




function Game() {
		
		//list of players
		this.players = [];
		this.scoreA = {r:"0",p:"0",s:"0"};
		this.scoreB = {r:"0",p:"0",s:"0"};
		//this.countDown(startTime,function(){console.log("lalala")});
	}

	Game.prototype.updatePlayer = function(data) {
		var hash = md5.md5(data.email);
		
		//if player exists, update score and send player to client
		for(var i=0;i< this.players.length;i++){
			
			if( hash == this.players[i].uid){
				
				var oldChoice = this.players[i].choice;
				
				var newChoice = this.players[i].updateChoice(data.choice);
				if(newChoice != null){
					this.updateScore(oldChoice, newChoice, this.players[i].team);
				}
				else{
					this.players[i].choice = oldChoice;
				}
					break;
			}
		}

		//if player doesn't exist, create new player	
		if(i == this.players.length){
			
			count++;
			this.players[i] = new Player(hash, data.email,data.choice);
			this.players[i].setTeam();
			this.players[i].updateChoice(this.players[i].choice);
			this.updateScore('null',this.players[i].choice ,this.players[i].team);
		}

		return this.players[i];
	}
	

	Game.prototype.updateScore = function(oldChoice,newChoice,team) {
		if(team == 1){
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

	}
	

	Game.prototype.startGame = function () {
		gameOn = true;
		// Start recieving emails


		// io.sockets.socket(gameEngine).emit('gameStart',gameDuration);  
		// //game.countDown(startTime,function(){io.sockets.socket(gameEngine).emit('gameEnd',{})});
		
		// //this.countDown(startTime,function(){console.log("lalala")});
		// // //send to client to start the game
		// // io.sockets.in(gameEngine).emit('gameTime', {gameTime: '1'});
		// // //start countdonw
		
		// // this.countDown(20, function () {

		// // 	io.sockets.in(gameEngine).emit('gameTime', {gameTime: '-1'});
		// // });
		// // //end game
	};
	
	
	//score is sent when the top choice changes
	Game.prototype.sendScore = function () {
		var scoreA = this.scoreA;
		var scoreB = this.scoreB;
		//test scores if any of the scores > %33
		var teamA = 'p';
		//find max
		if ((scoreA.r >= scoreA.p) && (scoreA.r >= scoreA.s))
		{
			teamA = 'r';
		}
		else if ((scoreA.s >= scoreA.r) && (scoreA.s >= scoreA.p))
		{
			teamA = 's';
		}

		var teamB = 'p';
		//find max
		if ((scoreB.r >= scoreB.p) && (scoreB.r >= scoreB.s))
		{
			teamB = 'r';
		}
		else if ((scoreB.s >= scoreB.r) && (scoreB.s >= scoreB.p))
		{
			teamB = 's';
		}
		
		
		
		if (count > 3)
		{
			
			//team = 0,1 choice = r,p,s
			var response = { teamA: teamA, teamB: teamB };
			teamChoice=response;
			//io.sockets.in(gameEngine).emit('updateScore', response);
			io.sockets.socket(gameEngine).emit('updateScore',response);
	
			
		}
	
	
		
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
		var response = { uid: player.uid, timestamp: timestamp, message: message, team: player.team, choice: player.choice};
		

		io.sockets.socket(gameEngine).emit('sendPlayer',response);
	
	};

	Game.prototype.findWinner=function(){
		if(teamChoice != null){
			var a=teamChoice.teamA;
			var b=teamChoice.teamB;
			var winner;
			if(a == 'r' && b =='s')
				winner='Team Red Wins!';
			else if(a == 's' && b == 'p')
				winner='Team Red Wins!';
			else if(a == 'p' && b == 'r')
				winner='Team Red Wins!';
			else if(b == 'r' && a =='s')
				winner='Team Blue Wins!';
			else if(b == 's' && a == 'p')
				winner='Team Blue Wins!';
			else if(b == 'p' && a == 'r')
				winner='Team Blue Wins!';
			else
				winner='Tie Game!';

			response = { winner :  winner, statA : this.scoreA, statB : this.scoreB };
			io.sockets.socket(gameEngine).emit('sendWinner', response );
			return winner;
		}
	};
	

	//utility for timer	
	
	
	
	function Player(hash, email, choice) {
		this.email = email;
		this.choice = choice;
		this.team = "";
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
		//console.log('New Choice:'+string);
		return this.choice;
	};
	
	
	Player.prototype.setTeam = function () {
		
		//choose team A or B
		
		if ((count % 2) == 0)
		{
			this.team = 0; //TEAM A
		}
		else
		{
			this.team = 1; //TEAM B
		}

	};


  	



//Client Connects
io.sockets.on('connection', function (socket) {
  	
  	//Server is ready to pair with it's device
  	//socket.emit('ready','Ready!');

  	//Server waits for client input
  	socket.on('gameStart', function() {
  		console.log('New Game Started');
    	gameEngine = socket.id;
    	console.log(gameEngine);
    	game.startGame();
    });

	socket.on('gameEnd', function(){
		console.log("Game end message received.");
		var winner = game.findWinner();
		gameOn = false;
	});
  	

  	socket.on('newEmail',function (data) {
  		console.log("New Email received");
  		console.log(data);
  		var player = game.updatePlayer(data);
	  		
	  	game.sendPlayer(player, data.msg);
  		
	  	game.sendScore();
	  	
    });
 

});

// The webhook will POST emails to whatever endpoint we tell it, so here we setup the endpoint /email
app.post('/email', function (req, res) {

	//while(ga){
	
	if(potentialFrom = req.body.from.match(/<(.+)>/)){
		var from = potentialFrom[1];
	}else{
		var from = req.body.from;
	}
		
	var data = {
		'email' : from,
		'choice': req.body.subject,
		'msg' : req.body.text
	};
	
	var player = game.updatePlayer(data);
	  		
	game.sendPlayer(player, data.msg);
  		
	game.sendScore();
	
/*

	fs.readFile('template/email.html', function (err, html) {
    if (err) {
        console.log(err) 
    }
    else{
    	
    	sendgrid.send({
		to: from,
		replyTo: 'email@corpsgame.bymail.in',
		from: 'game@corpsgame.com',
		fromname: 'coRPS Game',
		subject: 'Welcome to coRPS!',
		html: html
	}, function(success, message) {
		console.log(success);
	});	
    }
    
    });  	
*/

});
