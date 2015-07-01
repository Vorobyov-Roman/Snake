$(document).ready(function(){
	'use strict'

	var BODY_SIZE = $('#proto').width();
	$('#proto').remove();

	var WIDTH = Math.floor($('#container').width() / BODY_SIZE);
	var HEIGHT = Math.floor($('#container').height() / BODY_SIZE);

	var direction = {
		west:  37,
		north: 38,
		east:  39,
		south: 40,

		opposite: function(dir){
			switch (dir){
			case this.west:  return this.east;
			case this.north: return this.south;
			case this.east:  return this.west;
			case this.south: return this.north;
			}
		}
	};

	var boardObject = {
		emty: 0,
		obstacle: 1,
		food: 2
	};

	function GameBoard(size){
		this.grid = new Array(size.height);
		for (let i = 0; i != size.height; ++i){
			this.grid[i] = new Array(size.width);

			for (let j = 0; j != size.width; ++j){
				this.grid[i][j] = boardObject.emty;
			}
		}
	};
	var gameBoard = new GameBoard({ width: WIDTH, height: HEIGHT });

	function Snake(){
		function BodySegment(pos){
			var temp = $('<div class="snake"></div>').css({
				top:  pos.y * (BODY_SIZE),
				left: pos.x * (BODY_SIZE)
			});

			this.domObj = $('#container').append(temp).children().last();
			this.pos = pos;
			this.next = null;
		};

		this.position = { x: 10, y: 3 };
		this.face = direction.east;
		this.queue = new Array();

		this.head = new BodySegment({ x: this.position.x, y: this.position.y });
		this.tail = this.head;

		this.move = function(grow){
			if (this.queue.length > 0){
				var temp = this.queue.shift();

				if (this.face != direction.opposite(temp)){
					this.face = temp;
				}
			}

			if (!grow){
				gameBoard.grid[this.tail.pos.y][this.tail.pos.y] = boardObject.emty;
				this.tail.domObj.remove();
				this.tail = this.tail.next;
			}

			switch (this.face){
			case direction.west:
				this.head.next = new BodySegment({ x: --this.position.x, y: this.position.y });
				break;
			case direction.north:
				this.head.next = new BodySegment({ x: this.position.x, y: --this.position.y });
				break;
			case direction.east:
				this.head.next = new BodySegment({ x: ++this.position.x, y: this.position.y });
				break;
			case direction.south:
				this.head.next = new BodySegment({ x: this.position.x, y: ++this.position.y });
				break;
			}

			this.head.domObj.css('background-color', '#1F7872');
			this.head.next.domObj.css('background-color', '#505050');
			this.head = this.head.next;

			//handle collisions here

			gameBoard.grid[this.position.y][this.position.x] = boardObject.obstacle;
		}

		this.rotate = function(dir){
			switch (dir){
			case direction.west:
			case direction.north:
			case direction.east:
			case direction.south:
				this.queue.push(dir);

			default: break;
			}
		};

		gameBoard.grid[this.position.y][this.position.x] = boardObject.obstacle;
		for (let i = 0; i != 10; ++i){
			this.move(true);
		}
	};
	var snake = new Snake();
	var stop = false;

	$(document).keydown(function(key){
		snake.rotate(key.which);

		if (key.which == 32)
			stop = !stop;

		if (key.which == 90)
		{
			for (let i = 0; i != HEIGHT; ++i){
				console.log(gameBoard.grid[i]);
			}
		}
	});

	setInterval(function(){
		if (!stop){
			snake.move(false);
		}
	}, 50);
});
