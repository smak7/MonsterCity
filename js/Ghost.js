var Ghost = function(ctx,shapes){
  this.ctx = ctx;
  //loading ghost from image file - location
  this.x = window.innerWidth - 260;
  this.y = window.innerHeight/2;
  this.img = new Image();
  this.img.src = "data/ghost.svg";

  this.step = 2;
  this.radius = 50;
  this.mouthX = this.x+100;
  this.mouthY = this.y+128+20;
  this.color = "rgba(0,0,0,1)";
  //circle,triangle,square,hexagon,pentagon,octagon 360/points
  this.shapes = shapes;

}

Ghost.prototype = {

  move:function(val){
    this.y = val;
    this.mouthY = this.y+128+30;
  },

  display:function(){
    this.ctx.drawImage(this.img,this.x,this.y);
  },

  displayMouth:function(){
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    for(var i = 0;i<360;i+=this.shapes[this.step]){
      var _x = this.mouthX + Math.cos((i+90)*Math.PI/180)*this.radius;
      var _y = this.mouthY + Math.sin((i+90)*Math.PI/180)*this.radius;
      if(i==0){
        this.ctx.moveTo(_x,_y);
      }else{
        this.ctx.lineTo(_x,_y);
      }
    }
    this.ctx.closePath();
    // this.ctx.rotate(Math.PI/2);
    this.ctx.fill();
  }

}
