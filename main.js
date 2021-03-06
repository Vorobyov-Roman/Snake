$(document).ready(function(){
	'use strict'

	var BLOCK_SIZE = $('#proto').width();
	$('#proto').remove();

	var WIDTH = Math.floor($('#container').width() / BLOCK_SIZE);
	var HEIGHT = Math.floor($('#container').height() / BLOCK_SIZE);

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
		emty:     0,
		obstacle: 1,
		snake:    2,
		food:     3
	};

	function GameBoard(size){
		this.grid = new Array(size.height);

		this.spawnFood = function(){
			//find a spot
			var temp = new Array();
			for (let i = 0; i != size.height; ++i){
				for (let j = 0; j != size.width; ++j){
					switch (this.grid[i][j]){
						case boardObject.food:
							this.grid[i][j] = boardObject.emty;
							$('.food').remove();
						case boardObject.emty:
							temp.push({ row: i, col: j });
					}
				}
			}
			var index = temp[Math.floor(Math.random() * temp.length)];
			this.grid[index.row][index.col] = boardObject.food;
			
			//create a dom object
			$('#container').append($('<div class="food"></div>').css({
				top:  index.row * BLOCK_SIZE + (BLOCK_SIZE / 4),
				left: index.col * BLOCK_SIZE + (BLOCK_SIZE / 4)
			}));
		};

		for (let i = 0; i != size.height; ++i){
			this.grid[i] = new Array(size.width);

			for (let j = 0; j != size.width; ++j){
				this.grid[i][j] = boardObject.emty;
			}
		}

		for (let i = 0; i != size.height; ++i){
			this.grid[i][0] = boardObject.obstacle;
			this.grid[i][this.grid[i].length - 1] = boardObject.obstacle;
		}
		for (let j = 0; j != size.width; ++j){
			this.grid[0][j] = boardObject.obstacle;
			this.grid[this.grid.length - 1][j] = boardObject.obstacle;
		}

		function addBorder(t, l, w, h){
			$('#container').append($('<div class="block"></div>').css({
				top:    t * BLOCK_SIZE,
				left:   l * BLOCK_SIZE,
				width:  w * BLOCK_SIZE,
				height: h * BLOCK_SIZE
			}));
		}
		addBorder(0, 0, 1, this.grid.length);                        //left
		addBorder(0, this.grid[0].length - 1, 1, this.grid.length);  //right
		addBorder(0, 0, this.grid[0].length, 1);                     //top
		addBorder(this.grid.length - 1, 0, this.grid[0].length, 1);  //bottom
	};
	var gameBoard = new GameBoard({ width: WIDTH, height: HEIGHT });

	function Snake(){
		function BodySegment(pos){
			var temp = $('<div class="block body head"></div>').css({
				top:  pos.y * BLOCK_SIZE,
				left: pos.x * BLOCK_SIZE
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
					alert('Game Over');
					return boardObject.obstacle;

				case boardObject.snake:
					alert('Game Over');
					return boardObject.snake;

				case boardObject.food:
					this.fed = true;
					gameBoard.spawnFood();
					break;
			}

			gameBoard.grid[this.head.pos.y][this.head.pos.x] = boardObject.snake;
			return gameBoard.emty;
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

		this.clear = function(collision){
			var body = this.tail;

			while (body != null){
				gameBoard.grid[body.pos.y][body.pos.x] = boardObject.emty;
				body.domObj.remove();
				body = body.next;
			}

			if (collision == boardObject.obstacle){
				gameBoard.grid[this.head.pos.y][this.head.pos.x] = boardObject.obstacle;
			}
		};

		gameBoard.grid[this.head.pos.y][this.head.pos.x] = boardObject.snake;
		gameBoard.grid[this.tail.pos.y][this.tail.pos.x] = boardObject.snake;
		for (let i = 0; i != 10; ++i){
			this.fed = true;
			this.move();
		}

		gameBoard.spawnFood();
	};
	var snake = new Snake();
	
	$(document).keydown(function(key){
		snake.rotate(key.which);
	});

	setInterval(function(){
		switch (snake.move()){
			case boardObject.obstacle:
				snake.clear(boardObject.obstacle);
				snake = new Snake();
				break;
			case boardObject.snake:
				snake.clear(boardObject.snake);
				snake = new Snake();
				break;
		}
	}, 50);
});
