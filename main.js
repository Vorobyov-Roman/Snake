$(document).ready(function(){
	'use strict'

	var WIDTH  = 10,
	    HEIGHT = 10;

	var cellType = {
		empty_cell: 0,
		obstacle:   1,
		snake_body: 2,
		food:       3
	};
	var direction = {
		west:  0,
		north: 1,
		east:  2,
		south: 3
	};

	var gameBoard = new Array(HEIGHT);
	for (let i = 0; i != gameBoard.length; ++i) {
		gameBoard[i] = new Array(WIDTH);

		for (let j = 0; j != gameBoard[i].length; ++j) {
			gameBoard[i][j] = cellType.empty_cell;
		}
	}

	function Snake(){
		function BodySegment(nextSegment){
			this.next = nextSegment || null;
		};

		this.position = { x: 3, y: 3 };
		this.face = direction.east;

		this.head = new BodySegment();
	};
	var snake = new Snake();

/*
	console.log(snake);
	for (let i = 0; i != gameBoard.length; ++i) {
		console.log(gameBoard[i]);
	}
*/
});
