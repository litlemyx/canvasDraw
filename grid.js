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

function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
} 

function Grid(height = 256, width = 256, rows = 16, cols = 16, cn, position = {x:0, y:0} ){
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
      canvas.height = height;
      canvas.width = width;
      canvas.className = "dotted";
      document.body.appendChild(canvas);
      this.canvas = canvas;
      break;
  }

  var is_init = false;
  
  function _init(){
    if(is_init) {
      console.warn("Grid was already initiated already");
      return;
    }
    is_init = true;
    //this.canvas = cn;
    this.ctx = this.canvas.getContext("2d");

    this.x = position.x;
    this.y = position.y;

    this.width = width;
    this.height = height;

    this.rows = rows;
    this.cols = cols;

    this.field = [];
    for(var i=0; i<=cols; i++){
      this.field[i] = [];
      for(var j=0;j<=rows;j++){
        this.field[i][j] = [0,0,0,0];
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

    this._events = {
      "redraw": [this._draw],
      "renderFinish": [this.finish]
    };
  }

  this.getField = function(){
    return this.field;
  };
  

  this.gridClick = function(e){
    var x = Math.floor((e.pageX - this.canvas.offsetLeft)/rows),
        y = Math.floor((e.pageY - this.canvas.offsetTop)/cols);

        this._putPixel({x , y , color: [randomInteger(0,255),randomInteger(0,255),randomInteger(0,255),Math.random()]});

        this.fireEvent('redraw');
  };

  this.registerEvent = function(event, handler){
    this._events[event] ? this._events[event].push(handler) : this._events[event] = [handler];
  };

  this.finish = function(){
    this.fireEvent("redraw");
  };

  this.remap = function(map){
    let p,pp;
    let i = 0,j = 0;
    for(p of map){
      j=0;
      for(pp of  p){
        pp = typeof p === "Object"? p : {x: i , y: j , color : [1, 1, 1, pp]};
        this._putPixel(pp)
        j++;
      }
      i++;
    }
    
  };

  this._putPixel = function(params){
    const {x , y , color} = params; 
    this.field[y][x] = color;
  };

  this.putFigure = function(fig){
    const {position: {x, y}} =  fig;

    let i = 0, j = 0;
    let p, pp;
    for(p of fig.type.map){
      j=0;
      for(pp of p){
        this._putPixel({x: x+j, y: y+i, color: fig.color});
        j++;
      }
      i++;
    }
  };

  this.clearFigure = function(position, figureType){
    const {x, y} =  position;

    let i = 0, j = 0;
    let p, pp;
    for(p of figureType.map){
      j=0;
      for(pp of p){
        this._putPixel({x: x+j, y: y+i, color: [0,0,0,0]});
        j++;
      }
      i++;
    }
  };

  //Not finished
  this.clearRect = function(posStart, posEnd){
    // const {x, y} =  pos;

    // var fig = figureType;

    // let i = 0, j = 0;
    // let p, pp;
    // for(p of fig.map){
    //   j=0;
    //   for(pp of p){
    //     this._putPixel({x: x+j, y: y+i, color: 0});
    //     j++;
    //   }
    //   i++;
    // }
  };



  this.fireEvent = function(event){
    for(e of this._events[event]){
      e.call(this);
    }
  };

  this._draw = function(){

    var canvas = this.canvas,
    context = this.ctx;

    context.clearRect(0, 0, canvas.width, canvas.height);
    this.drawGrid();
    //context.fillStyle = "rgba("++")";
    //context.strokeRect(20,20,30,50);
    for(i=0;i<=cols;i++){
      for(j=0;j<=rows;j++){
        context.fillStyle = "rgba("+this.field[i][j].join(",")+")";
        context.fillRect(this.x + j*16,this.y + i*16,16,16);
      }
    }
  };

  this.generate =  function(){
    var i = 0;
    
    for(i; i<=cols; i++){
      this.field[i] = [];
      for(j=0;j<=rows;j++){
        this.field[i][j] = [randomInteger(0,255),randomInteger(0,255),randomInteger(0,255),Math.random()];
      }
    }

    this.fireEvent("redraw");
    
  };

  this.clear = function(){
    this.field = [];
    var i = 0;
    var j;
    for(i; i<=cols; i++){
      this.field[i] = [];
      for(j=0;j<=rows;j++){
        this.field[i][j] = [0,0,0,0];
      }
    }
    this.fireEvent("redraw");
  };


  this.drawGrid = function(position = {x:0, y:0}){
    var canvas = this.canvas,
    context = this.ctx;

    context.beginPath();
    context.fillStyle = "rgba(0,0,0,1)";
    const w_step = width/rows;
    const h_step = height/cols;
    var i = rows;
    for(i;i--;){
      context.moveTo(i*w_step, 0);
      context.lineTo(i*w_step, width);
    }
    i = cols;
    for(i;i--;){
      context.moveTo(0, i*h_step);
      context.lineTo(height, i*h_step);
    }
    context.closePath();
    context.stroke();
  };



  _init.call(this);
  this.drawGrid();

  return this;

}