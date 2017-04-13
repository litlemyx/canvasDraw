function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
} 

function throttle(func, ms=1) {

  var isThrottled = false,
      savedArgs,
      savedThis;

  wrapper = function() {

    if (isThrottled) { // (2)
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments); // (1)

    isThrottled = true;

    setTimeout(function() {
      isThrottled = false; // (3)
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }.bind(this);

  return wrapper;
}

function tetris(){

	this.grid = new Grid();

	var keysDown = {};

	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
	}, false);

	addEventListener("keyup", function (e) {
		delete keysDown[e.keyCode];
	}, false);

	this.blocksType = [
		{
			name: "line",
			map: [[1,1,1,1]]
		},
	];

	this.activeBlock = {};

	// {
	// 	position: {x: 1, y: 1},
	// 	color: [251,124,32, 0.4],
	// 	type: "line",
	// 	rotation: 0
	// }

	this.reset = function () {
		this.grid.clear();
		this.map = Array(16).fill(Array(16).fill(0));
		this.mapRedraw = true;
		this.needNew = true;
		this.speed = 3000;
	};

	this.generateBlock = function(){
		this.activeBlock = 
		{
			position: {x: 7, y: -1},
			exposition: {x: 7, y: -1},
			color: [randomInteger(0,255),randomInteger(0,255),randomInteger(0,255), 1],
			type: this.blocksType[0],
			rotation: 0
		}
	}



	// Update game objects
	this.update = function (modifier) {
		console.log("update tick");
		this.activeBlock.color = [randomInteger(0,255),randomInteger(0,255),randomInteger(0,255), 1];
		this.activeBlock.exposition = this.activeBlock.position;
		this.activeBlock.position.y++;
			
		// hero.running = false;
		// hero.jumping = false;

		// if (38 in keysDown) { // Player holding up
		// 	hero.y -= hero.speed * modifier;
		// 	hero.running = true;
		// }
		// if (40 in keysDown) { // Player holding down
		// 	hero.y += hero.speed * modifier;
		// 	hero.running = true;
		// }
		// if (37 in keysDown) { // Player holding left
		// 	hero.x -= hero.speed * modifier;
		// 	hero.running = true;
		// }
		// if (39 in keysDown) { // Player holding right
		// 	hero.x += hero.speed * modifier;
		// 	hero.running = true;
		// }

		// if (32 in keysDown) { // Player holding right
		// 	hero.jumping = true;
		// }

		// // Are they touching?
		// if (
		// 	hero.x <= (monster.x + 32)
		// 	&& monster.x <= (hero.x + 32)
		// 	&& hero.y <= (monster.y + 32)
		// 	&& monster.y <= (hero.y + 32)
		// ) {
		// 	++monstersCaught;
		// 	reset();
		// }
	};

	// Draw everything
	this.render = function () {
		if(this.mapRedraw){
			this.grid.remap(this.map);
			this.mapRedraw = false;
		}

		this.grid.clearFigure(this.activeBlock.exposition);

		this.grid.putFigure(this.activeBlock);

		this.grid.fireEvent("renderFinish");
	};

	// The main game loop
	this.main = (function(self){

			var update = throttle(self.update.bind(self), 3000);

			return function (then) {
				console.log("render tick");
				var now = Date.now();
				var delta = now - then;

				if(this.needNew){
					this.generateBlock();
					this.needNew=false;
				}


				update(delta / 1000);
				this.render();

				then = now;

				// Request to do this again ASAP
				var t = 100/6;
				//setTimeout(main, t-delta);

				var fps = 60;
				
				setTimeout(function() {
					requestAnimationFrame(function(){
						this.main(then);
					}.bind(this));
				}.bind(this), 1000 / fps);
			}
		
	})(this);

	// Cross-browser support for requestAnimationFrame
	var w = window;
	requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

	// Let's play this game!

	this.start = function(){
		let then = Date.now();
		this.reset();
		this.main(then);
	}
	

	return this;

}