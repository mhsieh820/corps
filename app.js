var express = require('express');
var sendgrid  = require('sendgrid')('rrmallya', 'corpsgame');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();
var server = require('http').createServer(app);

var io = require('socket.io').listen(server);
var md5 = require("./md5.min.js");
//var game = require("./gamecenter.js");
io.set("log level", 1);
server.listen(process.env.PORT || 80);
// all environments
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.favicon());
//app.use(express.bodyParser());

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
var gameEngine;
// The webhook will POST emails to whatever endpoint we tell it, so here we setup the endpoint /email
app.post('/email', express.bodyParser(), function (req, res) {

	// SendGrid gives us a lot of information, however, here we only need the person's email (to make sure they don't vote twice) and the subject which serves as their vote.
	// Note: Make sure you configure your app to use Express' Body Parse by doing: app.use(express.bodyParser());
	console.log("GOT EMAIL");
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
	
	// Finally, I want to thank everyone who voted, luckily SendGrid also will send email for me. I just need to tell it what to send.
	sendgrid.send({
		to: from,
		from: 'game@corpsgame.com',
		fromname: 'CMU Team',
		subject: 'Response',
		text:	'Hi!\n' +
				'Yay\n' +
				'--\n' +
				'Corpsgame'
	}, function(success, message) {
	
		if(!success) throw new Error(message);
	});

});



io.sockets.on('connection', function (socket) {
  	
  	game = new Game();
  	//connect game
  	//socket.emit('ready','Ready!');
  	socket.on('gameEngine', function(data){
    	gameEngine = socket.id;
    	console.log(gameEngine);
    	io.sockets.socket(gameEngine).emit('register', { register: 'yes' });
    });

  	
  //	console.log('emited ready');  	
  
  	//New Email Recieved
/*
  	socket.on('newEmail',function (data) {
  		console.log('email received'+data.email+data.msg+data.choice);
  		
  		var player = game.updatePlayer(data);
	  		
	  	game.sendPlayer(player, data.msg);
  		
	  	game.sendScore();
	  	
    });
*/
    
     //SOCKETS THAT COME IN FROM EMAIL
   
    
    //email
    
    //game ends
    
    

	//game engine
	function Game() {
		
		//list of players
		this.players = [];
		this.scoreA = {r:"0",p:"0",s:"0"};
		this.scoreB = {r:"0",p:"0",s:"0"};
		
	}

	Game.prototype.updatePlayer = function(data) {
		var hash = md5.md5(data.email);
		console.log('hash'+hash);
		//if player exists, update score and send player to client
		for(var i=0;i< this.players.length;i++){
			console.log(this.players[i].uid);
			if( hash == this.players[i].uid){
				console.log('play at position'+i);
				var oldChoice = this.players[i].choice;
				console.log(oldChoice);
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
			console.log('Creating new player');
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
		
		//send to client to start the game
		io.sockets.in(gameEngine).emit('gameTime', {gameTime: '1'});
		//start countdonw
		
		this.countDown(20, function () {
			io.sockets.in(gameEngine).emit('gameTime', {gameTime: '-1'});
		});
		//end game
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
			io.sockets.in(gameEngine).emit('updateScore', response);
			
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
		var response = { uid: player.uid, timestamp: timestamp, message: message, team: player.team };
		
			
		io.sockets.in(gameEngine).emit('sendPlayer',  response);
	
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
		console.log('player assigned team:'+this.team);
	};
	
	
	
  

});
