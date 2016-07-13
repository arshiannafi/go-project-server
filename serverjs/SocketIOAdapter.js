
var User = require("./User.js");



/*
* List of users that are currently online.
* 
* The variable should only contain "User" instances.
* See the User data structure in "./serverjs/User.js"
* 
* var onlineUsers = {
*		username1: User object,
*		username2: User object,
*		...
* 	}
*/
var onlineUsers = {};



/*
* This data structure is useful for user's corresponding socket lookup.
* This data structure contains socketid and username pairs for lookup purposes.
* The data structure will look like the following during runtime.
*
* var socketIDtoUser = {
*		socketid1: username1,
*		socketid2: username2,
*		...
* 	}
*/
var socketIDtoUser = {};





function listen(io) {
	
	io.on('connection', function (socket) {
		// A new user connected to the server here
		
		
		
/********************** List of Socket IO triggered events *********************
* 
* newPlayer		- when client connects and sends its username
* gameRequest	- when the server receives a game request from a client
* move			- when user makes a move
* disconnect	- Socket.io event. When a user disconnects
* 
* 
* 
******************** List of events triggered by our server ********************
*
* playerList    - List of online players. I.e. sending the 'onlineUsers' variable
* _error        - any serverside error that the client needs to know about.
*               E.g. to notify user.
* 
*******************************************************************************/
		
		
		
		// New user on the server
		socket.on('newPlayer', 
		
		/**
		* @param {string} username - username
		*/
		function (username) {
			
			// check if user is already on the server
			if (onlineUsers[username] === undefined){
				
				// Create new user
				var newUser = new User(username);
				newUser.setSocketid(socket.id);
				
				// Update dictionary
				onlineUsers[newUser.getUsername()] = newUser;
				socketIDtoUser[socket.id] = newUser.getUsername();
				
				// Send all client a list of all online players
				socket.emit("playerList", JSON.stringify(onlineUsers));
				socket.broadcast.emit("playerList", JSON.stringify(onlineUsers));
			} else {
				console.log("duplicate player");
				socket.emit("_error", "duplicate player");
			}
		});




                socket.on('userdata', function(request){
                    console.log(socket.id);
//                    if (request === 'all'){
//                        socket.emit('userdata',JSON.stringify(socketIDtoUser[socket.I]));
//                    } else {
//                        console.log("unknow request");
//                    }
                });


		
		
		// Server received a game request from a client
		socket.on('gameRequest',
		
		/**
		* @param {object} data - { fromUser: username , toUser: username }
		*/
		function(data) {
			
			// checking if the toUser is online
			if (io.sockets.connected[onlineUsers[data.toUser].getSocketid()] !== undefined){
				
				// update user data
				onlineUsers[data.fromUser].sentGameRequestTo(data.toUser);
				console.log(onlineUsers);
                                // send game request signal
				io.sockets.connected[onlineUsers[data.toUser].getSocketid()].emit("gameRequest", data.fromUser);	
			} else {
				socket.emit("_error", "player is not online");
			}
		});
		
		
                
                
		
		// When a user makes a move
		socket.on('move', function(data) {
			
			/*
			The data should include the following:
			
			data = {
				fromUser: username,
				toUser: username,
				move: object (to be decided data structure)
			}
			
			todo:
			- decide on a data structure
			- send the move

			*/
			
			/* Example: to send message to a specific socket id
			
			if (io.sockets.connected[socketid]) {
				io.sockets.connected[socketid].emit('eventName', 'message for the user');
			}
			*/
			
		});
		
		
		
		// Socket.io Event: Disconnect
		socket.on('disconnect', function () {
			// Remove user from server
			var username = socketIDtoUser[socket.id];
			delete(onlineUsers[username]);
			delete(socketIDtoUser[socket.id]);
			
			// Send playerList
			socket.broadcast.emit("playerList", JSON.stringify(onlineUsers));
		});

	});
	
}

module.exports = {
	listen : listen
}