/**
 * Created by user on 2015/4/14.
 */
CanvasRenderingContext2D.prototype.drawPoint = function (x, y) {
    this.save();
    this.beginPath();
    this.fillStyle = "red";
    this.arc(x, y, 1,0,Math.PI*2,false);
    this.fillText("("+x+","+y+")",x-15,y+10);
    this.fill();
    this.restore();
};

CanvasRenderingContext2D.prototype.drawGrid = function(color,stepX,stepY){
    this.save();
    this.strokeStyle = color;
    this.lineWidth = 1;
    var width = this.canvas.width;
    var height = this.canvas.height;
    for(var i =stepX+0.5;i<width;i+=stepX){//draw V
        this.beginPath();
        this.moveTo(i,0);
        this.lineTo(i,height);
        this.stroke();
    }
    for(var j=stepY+0.5;j<height;j+=stepY){//draw H
        this.beginPath();
        this.moveTo(0,j);
        this.lineTo(width,j);
        this.stroke();
    }
    this.restore();
};