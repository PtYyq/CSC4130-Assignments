window.addEventListener('load', ()=>{
    document.addEventListener('click', click);    
    document.addEventListener('mousedown', startdrawormove);
    document.addEventListener('mouseup', stopdrawormove);
    document.addEventListener('mousemove', sketch);
});

var canvas = new fabric.Canvas("canvas");
// disable multiple selection
canvas.on('selection:created', (e) => {
  if (e.target.type === 'activeSelection') {
    canvas.discardActiveObject();
  }
})
var isDown, origX, origY;

var colorinput = document.getElementById("favcolor");
var slider = document.getElementById("opacity");
var output_o = document.getElementById("value");
var colorvalue = document.getElementById('colorVal');
var shapevalue = document.getElementById("shape");


output_o.innerHTML = slider.value;
colorvalue.innerHTML = colorinput.value;

var tooltype = "draw";
var shapetype = "Circle";
var object;

function click(event){ 
  // if users click reset, clear all shapes in the interface (10pts)

  /* your code is here */
  if (tooltype == 'reset'){
    canvas.forEachObject(function (object) {
      canvas.remove(object);
    });
  }

}

function startdrawormove(event) {
  isDown = true;
    var pointer = canvas.getPointer(event); // get mouse position
    origX = pointer.x;
    origY = pointer.y;
    if (tooltype=="draw"){
      //Use fabric.Circle/Rect/Triangle to define a circle/rectangle/triangle, respectively. Each shape is for 9pts
     /* your code is here */
      if (shapetype=="Rect"){
        object = new fabric.Rect({
          width: 0,
          height: 0,
          left: origX,
          top: origY,
          fill: colorinput.value,
          strokeWidth: 2,
          stroke: 'gray',
          });
      }
      else if(shapetype=="Circle"){
        object = new fabric.Circle({ 
            radius:0,
            left: origX,
            top: origY, 
            fill: colorinput.value, 
            strokeWidth: 2,
            stroke: 'gray',
          });
      }
      else if (shapetype == "Triangle") {
        object = new fabric.Triangle({
          width:0,
          height:0,
          left: origX,
          top: origY,
          angle: 45,
          fill: colorinput.value,
          strokeWidth: 2,
          stroke: 'gray',
        });
      }

    // add the defined shape into canvas (3pts).
    /* your code is here */
      canvas.add(object);
    // make all objects unselectable in draw mode
      canvas.forEachObject(function (object) {
        object.selectable = false;
      });
    }
    else if (tooltype=="move"){
      // make all shapes selectable (4pts).
      /* your code is here */
      canvas.forEachObject(function (object) {
        object.selectable = true;
      });
    }
    
}

function stopdrawormove(event){
  isDown = false;
  // fix a little bug when changing from 'draw' mode to 'move' mode
  canvas.forEachObject(function (object){
    if (object.height == 0 || object.width == 0) {
      canvas.remove(object);
    }
  })
}

function sketch(event){
  if (tooltype=="draw"){
  if (!isDown) return;
    var pointer = canvas.getPointer(event); 
    if (shapetype == 'Circle'){
      // set the circle radius based on the mouse position (6pts)
      /* your code is here */
      object.set({ radius:Math.abs(pointer.x - origX)})
    }
    else if (shapetype == 'Rect' || shapetype == 'Triangle'){
      // set the width and height of rectangle or triangle based on the mouse position (6pts)
      /* your code is here */
      object.set({ width: Math.abs(pointer.x - origX), height: Math.abs(pointer.y - origY) });
    }
  }
  else if (tooltype == "move"){
    var pointer = canvas.getPointer(event);
    // move the selected shape  hint: use getActiveObject() function(8pts)
    /* your code is here */
    if (canvas.getActiveObject()!=null){
        canvas.getActiveObject().set({ left: pointer.x, top: pointer.y });
    }
  }

  // get all shapes from canvas (6pts) and change the opacity of each shape (6pts)

  /* your code is here */
  canvas.forEachObject(function (object) {
    object.opacity = slider.value;
  });
  // render all objects in the canvas
  canvas.renderAll();
}

function select_shape(shape){
  shapetype = shape.value;
}

function use_tool(tool){
  tooltype = tool;
}

slider.oninput = function() {
  output_o.innerHTML = this.value;
}

colorinput.oninput = function() {
  colorvalue.innerHTML = this.value;
}
