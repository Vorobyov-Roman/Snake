$(document).ready(function(){
	'use strict'

	var BODY_SIZE = $('.snake').width();

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
		south: 3,

		opposite: function(dir){
			switch (dir) {
			case west:  return east;
			case north: return south;
			case east:  return west;
			case south: return north;
			}
		}
	};

	var gameBoard = new Array(HEIGHT);
	for (let i = 0; i != gameBoard.length; ++i) {
		gameBoard[i] = new Array(WIDTH);

		for (let j = 0; j != gameBoard[i].length; ++j) {
			gameBoard[i][j] = cellType.empty_cell;
		}
	}

	function Snake(){
		function BodySegment(pos){
			this.domObj = $('<div class="snake"></div>');
			this.next = null;

			this.domObj.css({
				top: pos.y * (BODY_SIZE / 2),
				left: pos.x * (BODY_SIZE / 2)
			});

			$('#container').append(this.domObj);
		};

		this.position = { x: 3, y: 3 };
		this.face = direction.east;

		this.head = new BodySegment({ x: this.x, y: this.y });
		this.tail = this.head;

		this.move = function(grow){
			if (!grow) {
				this.tail.domObj.remove();
				this.tail = this.tail.next;
			}

			switch (this.face) {
			case direction.west:
				this.head.next = new BodySegment({ x: --this.x, y: this.y });
				break;
			case direction.north:
				this.head.next = new BodySegment({ x: this.x, y: --this.y });
				break;
			case direction.east:
				this.head.next = new BodySegment({ x: ++this.x, y: this.y });
				break;
			case direction.south:
				this.head.next = new BodySegment({ x: this.x, y: ++this.y });
				break;
			}

			this.head = this.head.next;

			//handle collisions here
		}

		for (let i = 0; i != 2; ++i) {
			this.move(true);
		}
	};
	var snake = new Snake();
});
