'use strict'

class AIGameController extends GameController {
	
	/* Inherited Variables:
	* __gameSpace, __view, and __playerTurn
	* See GameController for details
	* 
	* List of Variables
	* __networkAdapter		Adapter that handles all network communication.
	* 
	*/
	
	constructor(){
		super();
		this.__networkAdapter = new NetworkAdapter();
	}
	
	placeToken(player, x, y){
		
		var _this = this;
		
		var moveAccepted = this.__gameSpace.placeToken(this.__playerTurn, x, y);
		
		if (moveAccepted){
			
			//  request server for AI move
			this.__networkAdapter.getAIMove(this.__gameSpace.size, this.__gameSpace.getGrid(), this.__gameSpace.getLastMove(), function(res){
				
				var aiMove = JSON.parse(res);
				
				if(aiMove.pass){
					// AI passed
					// todo: handle passes
					log("The AI passed (did not place any token)");
				} else {
					var aiValid = _this.__gameSpace.placeToken(aiMove.c, aiMove.y, aiMove.x); // temporary fix: x=y and y=x
					if (!aiValid){
						// AI's move was not accepted by the placeToken() method
						log("AI made an invalid move");
					}
				}
				
				// Draw the AI made move
				_this.__view.draw();
			});
			
		} else {
			// todo: notify user that the move was not accepted
			// and ask to try again.
		}
	}
	
	pass(){
		console.log("unimplemented method call");
	}
	
	resign(){
		console.log("unimplemented method call");
	}
	
	end(){
		console.log("unimplemented method call");
	}
	
}