$(document).ready(function(){
	'use strict'

	var BODY_SIZE = $('#proto').width();
	$('#proto').remove();

	var direction = {
		west:  37,
		north: 38,
		east:  39,
		south: 40,

		opposite: function(dir){
			switch (dir) {
			case this.west:  return this.east;
			case this.north: return this.south;
			case this.east:  return this.west;
			case this.south: return this.north;
			}
		}
	};

	function Snake(){
		function BodySegment(pos){
			var temp = $('<div class="snake"></div>').css({
				top:  pos.y * (BODY_SIZE / 2),
				left: pos.x * (BODY_SIZE / 2)
			});

			this.domObj = $('#container').append(temp).children().last();
			this.next = null;
		};

		this.position = { x: 10, y: 3 };
		this.face = direction.east;
		this.allowRotation = true;

		this.head = new BodySegment({ x: this.position.x, y: this.position.y });
		this.tail = this.head;

		this.move = function(grow){
			if (!grow) {
				this.tail.domObj.remove();
				this.tail = this.tail.next;
			}

			switch (this.face) {
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

			this.head = this.head.next;

			//handle collisions here
		}

		this.rotate = function(dir){
			switch (dir) {
			case direction.west:
			case direction.north:
			case direction.east:
			case direction.south:
				if (this.face != direction.opposite(dir) && this.allowRotation)
				{
					this.face = dir;
					this.allowRotation = false;
				}
				break;

			default: break;
			}
		};

		for (let i = 0; i != 10; ++i) {
			this.move(true);
		}
	};
	var snake = new Snake();

	$(document).keydown(function(key){
		snake.rotate(key.which);
	});

	setInterval(function(){
		snake.allowRotation = true;
		snake.move(false);
	}, 50);
});
