'use strict'

class GameController {
	
	/** List of variables
	* 
	* __board 		- A GameSpace instance. Use setBoard()
	* __view		- A view instance. Use setView()
	* 
	* __playerTurn	- indicates the turn of the player. Use getPlayerTurn()
	* 
	*/
	
	constructor() {
		this.__playerTurn = 1; // black
	}
	
	/**
	* Returns 1 or 2 indicating which player's turn it is.
	* 
	* @returns {Number}
	*/
	getPlayerTurn(){
		return this.__playerTurn;
	}
	
	/**
	* This method swaps the player's turn.
	*/
	swapTurn(){
		//Swapping players
		if (this.__playerTurn === 1) {
		   this.__playerTurn = 2;
		} else if (this.__playerTurn === 2) {
		   this.__playerTurn = 1;
		}
	}
	
	setBoard(board){
		this.__board = board;
	}
	
	setView(view){
		this.__view = view;
	}
	
}