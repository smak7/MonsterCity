var Target = function(ctx,shapes){
  this.x = 0;
  this.y = 0;
  this.ctx = ctx;
  this.step = 1;
  this.radius = 50;
  this.color = "rgba(0,0,0,1)";
  this.shapes = shapes;
  this.speed = 1;
  this.ID;
  this.isAlive = true;
}

Target.prototype = {
  randomize:function(){
    this.x = 0;
    this.radius = 10 + Math.round(Math.random()*50);
    this.x = -this.radius;
    this.y =(this.radius*2) + Math.random()*(window.innerHeight-(this.radius*10))//window.innerHeight/2;
    this.color = "rgba(255,255,255,.5)";
    //this.color = "rgba("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+",1)";
    //choosing a shape from the array
    this.step = Math.floor(Math.random()*this.shapes.length);
    this.speed = Math.ceil(Math.random()*5);
     this.isAlive =true;
  },

  move:function(){
    this.x+=this.speed;
  },

  display:function(){

      this.ctx.fillStyle = this.color;
      this.ctx.beginPath();
      for(var i = 0;i<360;i+=this.shapes[this.step]){
        var _x = this.x + Math.cos((i+90)*Math.PI/180)*this.radius;
        var _y = this.y + Math.sin((i+90)*Math.PI/180)*this.radius;
        if(i==0){
          this.ctx.moveTo(_x,_y);
        }else{
          this.ctx.lineTo(_x,_y);
        }
      }
      this.ctx.closePath();
      this.ctx.fill();

  }
}
