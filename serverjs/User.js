'use strict'

/* List of variables:
*
* __username			- The name of the user. Only set once by the constructor
* __opponent			- The name of the opponent.
* __socketid			- Socket ID
*
* __sentGameRequestTo	- an array of all users that
*							this user sent a game request to.
*
*/

/* List of methods: 
*
* constructor			- for the User object
*
* +----------------------------------------------------------------------------+
* | Getters						| Setters
* +----------------------------------------------------------------------------+
* | 							| sentGameRequestTo
* | getUsername					| 
* | getOpponent					| setOpponent
* | getSocketid					| setSocketid
* +----------------------------------------------------------------------------+
*
*/

class User {
	
	constructor(username){
		this.__username = username;
		this.__sentGameRequestTo = [];
	}
	
	getUsername(){
		return this.__username;
	}
	
	setOpponent(opponent){
		this.__opponent = opponent;
	}
	
	getOpponent(){
		return this.__opponent;
	}
	
	setSocketid(socketid){
		this.__socketid = socketid;
	}
	
	getSocketid(){
		return this.__socketid;
	}
	
	sentGameRequestTo(toUser){
		this.__sentGameRequestTo.push(toUser)
	}
	
}

module.exports = User;