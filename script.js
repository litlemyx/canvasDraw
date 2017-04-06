function throttle(func, ms) {

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

window.onload = function(){
		var NNgrid = new Grid();

		//NNgrid.generate();

		var btn = document.querySelector("#reloadBtn");
		btn.addEventListener("click", function(){NNgrid.generate()});
		var btn = document.querySelector("#clearBtn");
		btn.addEventListener("click", function(){NNgrid.clear()});

}

function Grid(position = {x:0, y:0}, cn ){
	var canvas;
	switch(typeof cn){
		case "object":
			this.canvas = cn;
			break;
		case "string":
			canvas = document.querySelector("#reloadBtn").tagName;
			if(canvas.tagName !== "CANVAS"){
				//cosole.warn("Argument doesn't match type 'canvas'. Aborting.");
				throw("Element "+cn.id+" doesn't canvas");
				
			}
			break;
		default:
			canvas = document.createElement("canvas");
			canvas.height = 256;
			canvas.width = 256;
			canvas.className = "dotted";
			document.body.appendChild(canvas);
			this.canvas = canvas;
			break;
	}
	
	function _init(){
		//this.canvas = cn;
		this.ctx = this.canvas.getContext("2d");

		this.x = position.x;
		this.y = position.y;

		this.field = [];
		for(var i=0; i<=16; i++){
			this.field[i] = [];
			for(var j=0;j<=16;j++){
		  	this.field[i][j] = 0;
		  }
		}

		this.canvas.addEventListener("click", function(e){
			if(e.which == 3 || e.which == 2) return
			this.gridClick(e);
		}.bind(this));

		this.canvas.addEventListener("contextmenu", function(e){
			return false;
		});

		this.canvas.addEventListener("mousemove", (function(){
														var fn = throttle.call(this, this.gridClick);
														return function(e){
															if(e.buttons == 1){
																fn(e)
															}
														}.bind(this)
													}.bind(this)
													)()
		);

		this.events = {
			"redraw": [this._draw]
		};
	}
	

	this.gridClick = function(e){
		var y = Math.floor((e.pageX - this.canvas.offsetLeft)/16),
       		x = Math.floor((e.pageY - this.canvas.offsetTop)/16);

       	this._putPixel({x , y , color: 1});

       	this.fireEvent('redraw');
	};

	

	

	this._putPixel = function(params){
		var {x , y , color} = params; 
		this.field[x][y] = color;
		
	};

	this.fireEvent = function(event){
		for(e of this.events[event]){
			e.call(this);
		}
	};

	this._draw = function(){

		var canvas = this.canvas,
		context = this.ctx;

		context.clearRect(0, 0, canvas.width, canvas.height);
		this.drawGrid();
		context.fillStyle = "rgba(0,0,0,1)";
		//context.strokeRect(20,20,30,50);
		for(i=0;i<=16;i++){
			for(j=0;j<=16;j++){
		  	context.fillStyle = "rgba(0,0,0,"+this.field[i][j]+")";
		  	context.fillRect(this.x + j*16,this.y + i*16,16,16);
		  }
		}
	};

	this.generate =  function(){
		var i = 0;
		
		for(i; i<=16; i++){
			this.field[i] = [];
			for(j=0;j<=16;j++){
		  	this.field[i][j] = Math.random();
		  }
		}

		this.fireEvent("redraw");
		
	};

	this.clear = function(){
		this.field = [];
		var i = 0;
		var j;
		for(i; i<=16; i++){
			this.field[i] = [];
			for(j=0;j<=16;j++){
		  	this.field[i][j] = 0;
		  }
		}
		this.fireEvent("redraw");
	};


	this.drawGrid = function(position = {x:0, y:0}){
		var canvas = this.canvas,
		context = this.ctx;

		context.beginPath();
		context.fillStyle = "rgba(0,0,0,1)";
		var i = 16;
		for(i;i--;){
			context.moveTo(i*16, 0);
			context.lineTo(i*16, 256);
			context.moveTo(0, i*16);
			context.lineTo(256, i*16);
		}
		context.closePath();
		context.stroke();
	};



	_init.call(this);
	this.drawGrid();

	return this;

}