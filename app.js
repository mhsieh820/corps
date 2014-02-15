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

  

});
