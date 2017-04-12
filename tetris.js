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



	// Reset the game when the player catches a monster
	this.reset = function () {
		this.grid.clear();
		this.map = Array(16).fill(Array(16).fill(0.5));
		this.mapRedraw = true;
	};

	// Update game objects
	this.update = function (modifier) {
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
		this.grid.remap(this.map);
	};

	// The main game loop
	this.main = function (then) {
		var now = Date.now();
		var delta = now - then;

		this.update(delta / 1000);
		this.render();

		then = now;

		// Request to do this again ASAP
		var t = 100/6;
		//setTimeout(main, t-delta);
		requestAnimationFrame(function(){
			this.main(then);
		}.bind(this));
	};

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