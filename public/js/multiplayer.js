

var socket = io();

/**
 * This object must be retrieved from the server.
 * And since this will be recieved from sever, this object will follow
 * sever-side User specification
 * 
 * @type server-side User object
 */
var user;

getUserData();




/********************** JavaScript and DOM manipulation ***********************/

/* List of functions for DOM manipulation
*
* decorateProfile		- updates the profile section
* onReceivedPlayerList		- inflates the online players' section
* sendGameRequest		- sends a game request to an user
* onReceivedGameRequest		- when the client receives a game request
* onLogoutButtonPress		- when the user presses the logout button
* 
*/



/**
* This function updates the profile section of the page.
*/
function decorateProfile(){
	$('#profile-username').html(user.__username);
	// other profile related stuff
}

/**
* This function is called when the 
* 
* @param{object} playerList - 'onlineUsers' object form the server
*/
function onReceivedPlayerList(playerList){

	// Clear the UI
	$('#onlinePlayers-list').empty();
        
        // todo when server sends the list, check list to see if 
        console.log(playerList);
	
	// generate new list on the UI
	for (p in playerList) {
                // excluding self from appearing on the list
		if(p != user.username){ // != instead of !== for type conversion
			$('#onlinePlayers-list').append(makeOnlineUserRow(playerList[p]));
		}
	}
        
	/**
	* Creates a row for the online users' section
	*
	* @param {object} forUser - User object (follows server-side
	*											User object standards)
	*/
	function makeOnlineUserRow(forUser){
		
		// A row for the player
		var div = $(document.createElement('div'));
		div.attr("class","onlinePlayers-row");
		
                // Button to send request
		var reqButton = makeRequestButton(forUser);
		
		// Nesting DOM elements. All that goes in a row for each player
		div.append(forUser.__username);
		div.append(reqButton);
		
		return div;
	}
        
}



/**
* Creates a button to challenge a user
*
* @param {object} forUser - User object (follows server-side
*											User object standards)
*/
function makeRequestButton(forUser){

        // A button to send game request
        var reqButton = $(document.createElement('div'));

        reqButton.attr("class","button_sendRequest");
        reqButton.html("Send Invitation");

        reqButton.click(function(){
            
            // Send game request to user
            sendGameRequest(forUser.__username);

            // Updating UI to notify the user that the game invitation was sent
            $(this).replaceWith(getRequestSentButton());
            
        });

        return reqButton;
}

function getRequestSentButton(){
    var requestSentButton;
    
    requestSentButton =  $(document.createElement('div'));
    requestSentButton.html("Invitation Sent");
    requestSentButton.attr("class","button_requestSent");
    requestSentButton.click(function(){
        // todo notify user to wait for opponent to accept request
        console.log("request has been sent. please wait. unimplemented");
    });
    
    return requestSentButton;
}



/**
* This function sends a game request to the target user
*
* @param {string} toUser - The target user
*/
function sendGameRequest(toUser){
	var data = {
		toUser: toUser,
		fromUser: user.username
	};
	networkAdapter.inviteToGame(data);
}



/**
* This function is called when the user receives a game request
* 
* @param {string} fromUser - username
*/
function onReceivedGameRequest(fromUser){
	var div = $(document.createElement('div'));
	div.attr("class","gameRequest-row");
	div.html(fromUser + " challenged you.");
	
        // todo change to div buttons
	var button_accept = $(document.createElement('button'));
	button_accept.html("accept");
	button_accept.click(function(){
		log("accepted request. unimplemented method call");
	});
	
	var button_decline = $(document.createElement('button'));
	button_decline.html("decline");
	button_decline.click(function(){
		log("declined request. unimplemented method call");
	});
	
	div.append(button_accept);
	div.append(button_decline);
	$("#gameRequests-list").append(div);
}



/**
* This function is called when the user clicks the logout button
*/
function onLogoutButtonPress(){
	log("logout button pressed. unimplemented method call.");
}



function lockDownUI(){
    $("html").html("You are currently not logged in"); // todo fancy UI
}






/********************************* Socket IO **********************************/
/* List of Socket IO triggered events.
* 
* playerList 		- when the server sends a list of all online players
* gameRequest		- when the server sends a game request
* _error			- when the server sends an error signal that require
*						client-side attention (e.g. user account is
*						already logged in, target user is offline etc.)
*
*/


socket.on('_random', function (data) { // todo delete after account
        console.log(data);
        user = data;
        sessionStorage.sessionID = user.__username;
        decorateProfile();
});


socket.on('userdata', function (data) { // todo delete after account
        console.log(data);
        user = data;
        sessionStorage.sessionID = user.__username;
        decorateProfile();
});


// Event: When client receives online players' list
socket.on('playerList', function (data) {

        // String to object
        var playerList = JSON.parse(data);

        onReceivedPlayerList(playerList);
});



// The client received a game request
socket.on('gameRequest', function (fromUser) {
        onReceivedGameRequest(fromUser);
});



// Log Error if server sends an error message
socket.on('_error', function (data) {
        if (data === "duplicate player"){
                $("body").html("this account is already logged in");
        } else if (data === "player is not online") {
                log("player is not online. unimplemented"); // todo
        } else {
                console.log(data);
        }
});


/********************************* Functions **********************************/

/**
* @param {object} data - { toUser: username, fromUser: username}
*/
function inviteToGame(data){
    socket.emit("gameRequest", data);
}

/**
* @param {string} username - client user's username
*/
//function sendUsername(username){
//    socket.emit("newPlayer", username);
//}

function getUserData(){
    // todo, at the end of all dev, move from sessionStorage to local storage (scope: from tab to window)
    if (sessionStorage.sessionID === undefined){ 
        // lockDownUI(); // todo uncomment this once accounts are supported
        
        // for dev purposes, get random name
        socket.emit("_random", "_random"); // todo delete after account
    } else {
        socket.emit("userdata", sessionStorage.sessionID);
    }
}

/****************************** End of Socket IO ******************************/


