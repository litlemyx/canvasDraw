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

function debounce(f, ms) {

  var state = null;

  var COOLDOWN = 1;

  return function() {
    if (state) return;

    f.apply(this, arguments);

    state = COOLDOWN;

    setTimeout(function() { state = null }, ms);
  }.bind(this);

}

function tetris(h, w, c, r){
	var height = h,  width = w, cols = c, rows = r;
	this.grid = new Grid(h, w, c, r);

	var keysDown = {};

	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
	}, false);

	addEventListener("keyup", function (e) {
		//delete keysDown[e.keyCode];
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
		this.map = Array(cols).fill(Array(rows).fill(0));
		this.mapRedraw = true;
		this.needNew = true;
		this.speed = 3000;
		this.isPause = false;
	};

	this.generateBlock = function(){
		this.activeBlock = 
		{
			position: {x: 0, y: 0},
			exposition: {x: 0, y: 0},
			color: [randomInteger(0,255),randomInteger(0,255),randomInteger(0,255), 1],
			type: this.blocksType[0],
			rotation: 0
		}
	}



	// Update game objects
	this.update = function (modifier) {
		console.log("update tick");
		//this.activeBlock.color = [randomInteger(0,255),randomInteger(0,255),randomInteger(0,255), 1];
		if(this.needNew){
					this.generateBlock();
					this.needNew=false;
		}
		else{
			let {x, y} = this.activeBlock.position;
			this.activeBlock.exposition = {x, y};
			this.activeBlock.position.y++;
		}

		if (37 in keysDown) { // Player holding left
			this.activeBlock.position.x && this.activeBlock.position.x-- ;
			delete keysDown[37];
		}
		if (39 in keysDown) { // Player holding right
			(this.activeBlock.position.x < cols) && this.activeBlock.position.x++;	
			delete keysDown[39];
		}
		
			
		// hero.running = false;
		// hero.jumping = false;

		

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

		this.grid.clearFigure(this.activeBlock.exposition, this.activeBlock.type);

		this.grid.putFigure(this.activeBlock);

		this.grid.fireEvent("renderFinish");

		
	};

	this.keysHandler = function(){
		if (80 in keysDown) { // Player holding up
			this.isPause = !this.isPause;
			delete keysDown[80];
		}
		if (38 in keysDown) { // Player holding up
			
		}
		if (40 in keysDown) { // Player holding down
			
		}

		if (37 in keysDown) { // Player holding left
			if(this.activeBlock.position.x){
				let {x, y} = this.activeBlock.position;
				this.activeBlock.exposition = {x, y};
				this.activeBlock.position.x--; 
			}
			delete keysDown[37];
		}
		if (39 in keysDown) { // Player holding right
			if(this.activeBlock.position.x < 12){
				let {x, y} = this.activeBlock.position;
				this.activeBlock.exposition = {x, y};
				this.activeBlock.position.x++; 
			}
			delete keysDown[39];
		}
		
	};

	// The main game loop
	this.main = (function(self){

			var update = debounce(self.update.bind(self), 3000);

			return function (then) {
				var fps = 60;

				setTimeout(function() {
					requestAnimationFrame(function(){
						this.main(then);
					}.bind(this));

				}.bind(this), 1000 / fps);

				console.log("main tick");
				var now = Date.now();
				var delta = now - then;

				this.keysHandler();

				if(!this.isPause){
						update(delta / 1000);
					}
				this.render();

				then = now;

				// Request to do this again ASAP
				var t = 100/6;
				//setTimeout(main, t-delta);
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