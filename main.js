$(document).ready(function(){
	'use strict'

	var BODY_SIZE = $('.body#proto').width();
	$('.body#proto').remove();

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
		snake: 2,
		food: 3
	};

	function GameBoard(size){
		this.grid = new Array(size.height);

		for (let i = 0; i != size.height; ++i){
			this.grid[i] = new Array(size.width);

			for (let j = 0; j != size.width; ++j){
				this.grid[i][j] = boardObject.emty;
			}
		}

		this.spawnFood = function(){
			//find a spot
			//create a dom object
		};

		function addDomElem(i, j){
			var elem = $('<div class="block"></div>').css({
				top:  i * BODY_SIZE,
				left: j * BODY_SIZE
			});
			$('#container').append(elem);
		};

		for (let i = 0; i != size.height; ++i){
			this.grid[i][0] = boardObject.obstacle;
			this.grid[i][this.grid[i].length - 1] = boardObject.obstacle;

			addDomElem(i, 0);
			addDomElem(i, this.grid[i].length - 1);
		}
		for (let j = 0; j != size.width; ++j){
			this.grid[0][j] = boardObject.obstacle;
			this.grid[this.grid.length - 1][j] = boardObject.obstacle;
			
			addDomElem(0, j);
			addDomElem(this.grid.length - 1, j);
		}
	};
	var gameBoard = new GameBoard({ width: WIDTH, height: HEIGHT });

	function Snake(){
		function BodySegment(pos){
			var temp = $('<div class="block body head"></div>').css({
				top:  pos.y * BODY_SIZE,
				left: pos.x * BODY_SIZE
			});

			this.domObj = $('#container').append(temp).children().last();
			this.pos = pos;
			this.next = null;
		};

		this.face = direction.east;
		this.queue = new Array();

		this.tail = new BodySegment({ x: 9, y: 3 });
		this.head = new BodySegment({ x: 10, y: 3 });
		this.tail.next = this.head;
		this.tail.domObj.toggleClass('head');

		this.fed = false;

		this.move = function(){
			if (this.queue.length > 0){
				let temp = this.queue.shift();

				if (this.face != direction.opposite(temp)){
					this.face = temp;
				}
			}

			if (!this.fed){
				gameBoard.grid[this.tail.pos.y][this.tail.pos.x] = boardObject.emty;
				this.tail.domObj.remove();
				this.tail = this.tail.next;
			} else {
				this.fed = false;
			}

			switch (this.face){
				case direction.west:
					this.head.next = new BodySegment({ x: this.head.pos.x - 1, y: this.head.pos.y });
					break;

				case direction.north:
					this.head.next = new BodySegment({ x: this.head.pos.x, y: this.head.pos.y - 1 });
					break;

				case direction.east:
					this.head.next = new BodySegment({ x: this.head.pos.x + 1, y: this.head.pos.y });
					break;

				case direction.south:
					this.head.next = new BodySegment({ x: this.head.pos.x, y: this.head.pos.y + 1 });
					break;
			};

			this.head.domObj.toggleClass('head');
			this.head = this.head.next;

			//handle collisions here
			switch (gameBoard.grid[this.head.pos.y][this.head.pos.x]){
				case boardObject.obstacle:
				case boardObject.snake:
					alert('Game Over');
					return false;
					break;

				case boardObject.food:
					this.fed = true;
					//spawn another food
					break;
			}

			gameBoard.grid[this.head.pos.y][this.head.pos.x] = boardObject.snake;
			return true;
		};

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

		this.clear = function(){
			var body = this.tail;

			while (body != null){
				gameBoard.grid[body.pos.y][body.pos.x] = boardObject.emty;
				body.domObj.remove();
				body = body.next;
			}
		};

		gameBoard.grid[this.head.pos.y][this.head.pos.x] = boardObject.snake;
		gameBoard.grid[this.tail.pos.y][this.tail.pos.x] = boardObject.snake;
		for (let i = 0; i != 10; ++i){
			this.fed = true;
			this.move();
		}
	};
	var snake = new Snake();
	var stop = true;

	$(document).keydown(function(key){
		snake.rotate(key.which);

		if (key.which == 32){
			stop = !stop;
		} else if (key.which == 90){
			console.log('board:');
			for (let i = 0; i != HEIGHT; ++i){
				console.log(gameBoard.grid[i]);
			}
		}
	});

	setInterval(function(){
		if (!stop){
			if (!snake.move()){
				snake.clear();
				snake = new Snake();
			}
		}
	}, 50);
});
