//var io;
//var gameSocket;



//create game
exports.initGame = function(sio, socket) {
	
	io = sio	gameSocket = socket;
	
	gameSocket.emit('connected', { message: "Game;
 Connected"});
	
	gameSocket.on("hostCreateNewGame", hostCreateNewGame);
	
	gameSocket.on("hostStartGame", hostStartGame);	
}

//host functoins

//create new game
function hostCreateNewGame() {
	//create unique game room
	var gameRoom = 1;
	
	this.emit("gameCreated". {gameRoom: gameRoom, socketID : this.id})
	
	this.join(gameRoom.toString());
}

//start game
function hostStartGame() {
	
	
}


//player functions
//joingame through email setup
//use start icon


//submit move
//submit message


//game logic

//calculate winner
//update team