/**
 * Created by user on 2015/4/13.
 */
console.log("init");
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    eraseAllButton = document.getElementById("eraseAllButton"),
    strokeStyleSelect = document.getElementById("strokeStyleSelect"),
    drawTypeSelect = document.getElementById("drawTypeSelect"),
    guideWireCheckbox = document.getElementById("guideWireCheckbox"),
    drawingSurfaceImageData,
    mouseDown = {},
    rubberBandRect = {},
    dragging = false,
    drawType = drawTypeSelect.value,
    guideWires = guideWireCheckbox.checked;
console.log("init");
//functions...
function drawGrid(color,stepX,stepY){
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;
    for(var i =stepX+0.5;i<width;i+=stepX){//draw V
        ctx.beginPath();
        ctx.moveTo(i,0);
        ctx.lineTo(i,height);
        ctx.stroke();
    }
    for(var j=stepY+0.5;j<height;j+=stepY){//draw H
        ctx.beginPath();
        ctx.moveTo(0,j);
        ctx.lineTo(width,j);
        ctx.stroke();
    }
    ctx.restore();
}
function windowToCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height)
    };
}

function saveDrawingSurface(){
    drawingSurfaceImageData = ctx.getImageData(0,0,canvas.width,canvas.height);
}
function restoreDrawingSurface(){
    ctx.putImageData(drawingSurfaceImageData,0,0);
}
//GuideWires
function drawVerticalLine(x){
    ctx.beginPath();
    ctx.moveTo(x+0.5,0);
    ctx.lineTo(x+0.5,ctx.canvas.height);
    ctx.stroke();
}
function drawHorizontalLine(y){
    ctx.beginPath();
    ctx.moveTo(0,y+0.5);
    ctx.lineTo(ctx.canvas.width,y+0.5);
    ctx.stroke();
}
function drawGuideWires(x,y){
    ctx.save();
    ctx.strokeStyle="rgba(0,0,230,0.4)";
    ctx.lineWidth=0.5;
    drawVerticalLine(x);
    drawHorizontalLine(y);
    ctx.restore();
}
//rubber band
function updateRubberBand(loc){
    updateRubberBandRectangle(loc);
    switch(drawType){
        case "line":
            drawLine(loc);
            break;
        case "rect":
            drawRect(loc);
            break;
        case "circle":
            drawCircle2(loc);
            break;
    }

}
function updateRubberBandRectangle(loc){
    rubberBandRect.width = Math.abs(loc.x-mouseDown.x);
    rubberBandRect.height = Math.abs(loc.y-mouseDown.y);
    rubberBandRect.left = (loc.x>mouseDown.x)?mouseDown.x:loc.x;
    rubberBandRect.top = (loc.y>mouseDown.y)?mouseDown.y:loc.y;
}
function drawLine(loc){
    ctx.beginPath();
    ctx.moveTo(mouseDown.x,mouseDown.y);
    ctx.lineTo(loc.x,loc.y);
    ctx.stroke();
}
function drawRect(loc){
    ctx.beginPath();
    ctx.moveTo(mouseDown.x,mouseDown.y);
    ctx.lineTo(loc.x,mouseDown.y);//top line
    ctx.lineTo(loc.x,loc.y);//right line
    ctx.lineTo(mouseDown.x,loc.y);//bottom line
    ctx.lineTo(mouseDown.x,mouseDown.y);//left line
    ctx.stroke();
}
function drawCircle(loc){
    var radius,angle;
    if(mouseDown.y==loc.y){
        radius = Math.abs(loc.x-mouseDown.x);
    }else{
        angle = Math.atan(rubberBandRect.height,rubberBandRect.width);
        radius = rubberBandRect.height/Math.sin(angle);
    }
    ctx.beginPath();
    ctx.arc(mouseDown.x,mouseDown.y,radius,0,Math.PI*2,false);
    ctx.stroke();
}
function drawCircle2(loc){
    var rx = rubberBandRect.left+rubberBandRect.width/2;
    var ry = rubberBandRect.top+rubberBandRect.height/2;
    ctx.beginPath();
    ctx.arc(rx,ry,rubberBandRect.width/2,0,Math.PI*2,false);
    ctx.stroke();
}
canvas.onmousedown = function (e) {
    console.log("mouseDown");
    var loc = windowToCanvas(e.clientX, e.clientY);
    e.preventDefault();
    saveDrawingSurface();
    mouseDown.x = loc.x;
    mouseDown.y =loc.y;
    dragging = true;
};
canvas.onmousemove = function(e){
    var loc;
    if(dragging){
        //console.log("mouseMove");
        e.preventDefault();
        loc = windowToCanvas(e.clientX, e.clientY);
        console.log("x="+ loc.x+",y="+ loc.y);
        restoreDrawingSurface();
        updateRubberBand(loc);
        if(guideWires){
            drawGuideWires(loc.x,loc.y);
        }
    }
};
canvas.onmouseup = function(e){
    loc = windowToCanvas(e.clientX, e.clientY);
    restoreDrawingSurface();
    updateRubberBand(loc);
    dragging = false;
};

eraseAllButton.onclick = function(e){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawGrid("lightgray",10,10);
    saveDrawingSurface();
};
strokeStyleSelect.onchange = function(e){
    ctx.strokeStyle = strokeStyleSelect.value;
};
drawTypeSelect.onchange = function(e){
    drawType = drawTypeSelect.value;
};
guideWireCheckbox.onchange = function(e){
    guideWires = guideWireCheckbox.checked;
};

ctx.strokeStyle = strokeStyleSelect.value;
drawGrid("lightgray",10,10);