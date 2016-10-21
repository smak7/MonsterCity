var App = function(){
  this.canvas       = document.getElementById("canvas");
  this.width        = window.innerWidth;
  this.height       = window.innerHeight;
  this.canvas.width = this.width;
  this.canvas.height= this.height;
  this.ctx          = this.canvas.getContext("2d");

  this.allTargets = [];
  this.counter = 0;
  this.limit = 100;
  this.numberofTargets = 700;
  this.shapes = [1,120,90,60,72,45];

  this.ghost;
  this.chris;
  this.score = 0;

  this.displayedObject = {};

  this.deadObjects = [];
  this.startingSound;
  this.gameoverSound;
  this.eatSound;
  this.audioIcon = new Image();
  this.audioIcon.src = "data/audioOn.svg";
  this.audioIconLocation = {x1:this.width-70, width:50, y1:20, height:50}


  this.gameStart = false;
  this.gameOver = false;
  this.gamePlay = false;
  this.gameOverImage = new Image();
  this.gameOverImage.src = "data/gameOver.svg";

  this.gameIntro = new Image();
  this.gameIntro.src = "data/gameIntro.svg";

  this.gamePlay = new Image();
  this.gamePlay.src = "data/bg.svg";

  //time stamp
  this.gameStartTime = new Date();
  this.gameStartWait = 2400;

  this.gameOverTime = new Date();
  this.gameOverWait = 2000;

  this.setup();
}

App.prototype = {

  

  // midiControl:function(val){
  //     switch(val[3]){
  //       // case 0:
  //       //   //action trigger value based on val[4]
  //       //     this.updateRadius(val[4].map(0,127,10,120));
  //       // break;
  //       case 0:
  //         //action trigger value based on val[4]
  //         this.ghost.move(val[4].map(0,127,0,this.height-256));
  //       break;
  //       case 1:
  //         //action trigger value based on val[4]
  //         this.ghost.radius = val[4].map(0,127,5,60);
  //       break;
  //       case 16:
  //       // this.ghost.shapes.length - using the length of the array - the numb of shapes available
  //           this.ghost.step = Math.floor(val[4].map(0,127,0, this.ghost.shapes.length-1));
  //       break;
  //       case 6:
  //         //action trigger value based on val[4]
  //         this.chris.move(val[4].map(0,127,0,this.height-256));
  //       break;
  //       case 7:
  //         //action trigger value based on val[4]
  //         this.chris.radius = val[4].map(0,127,5,60);
  //       break;
  //       case 22:
  //       // this.ghost.shapes.length - using the length of the array - the numb of shapes available
  //           this.chris.step = Math.floor(val[4].map(0,127,0, this.chris.shapes.length-1));
  //       break;


  //     }

  // },


  setup:function(){
    this.ghost = new Ghost(this.ctx,this.shapes);
    this.chris = new Chris(this.ctx,this.shapes);
    this.generateRandomTargets();

    this.draw();

    this.startingSound = document.createElement('audio');
    var att = document.createAttribute('boundaries');
    att.value = JSON.stringify(this.audioIconLocation);
    this.startingSound.setAttributeNode(att);
    this.startingSound.src = "data/podington bear - dancing on the talkfloor.mp3";
    this.startingSound.preload = true;
    this.startingSound.loop = false;
    this.startingSound.load();
    document.body.appendChild(this.startingSound);
    this.startingSound.play();

  },

  updateShape:function(val){
    for(var i = 0;i<this.allTargets.length;i++){
      this.allTargets[i].step = val;
    }
  },

  updateRadius:function(val){
    for(var i = 0;i<this.allTargets.length;i++){
      this.allTargets[i].radius = val;
    }
  },

  createRandomTarget:function(id){
    var t = new Target(this.ctx,this.shapes);
    t.ID =id;
    //t.randomize();
    return t;
  },

  generateRandomTargets:function(){
      for(var i = 0; i<this.numberofTargets;i++){
        this.allTargets.push(this.createRandomTarget(i));
      }
  },

  eat:function(){
    // checking the size of the target agianst the ghosts mouth
    //for(var i = 0;i<this.allTargets.length;i++){
    for(var i in this.displayedObject){
      if(
        Math.abs(this.displayedObject[i].x-this.ghost.mouthX)< 10 &&
        Math.abs(this.displayedObject[i].y-this.ghost.mouthY)< 10 &&
        (this.ghost.radius-this.displayedObject[i].radius)< 10 &&
        (this.ghost.radius-this.displayedObject[i].radius)> 0 &&
        (this.ghost.step == this.displayedObject[i].step)
        ){
        // this.displayedObject[i].x = 10000;
        // this.score ++;
        // console.log("shape should disapear")
         var t = this.displayedObject[i];
         this.allTargets.push(t);
         delete this.displayedObject[i];

         this.eatSound = document.createElement('audio');
         this.eatSound.src = "data/s2.mp3";
         this.eatSound.preload = true;
         this.eatSound.loop = false;
         this.eatSound.load();
         document.body.appendChild(this.eatSound);
         this.eatSound.play();
      }else if(
        Math.abs(this.displayedObject[i].x-this.chris.mouthX)< 10 &&
        Math.abs(this.displayedObject[i].y-this.chris.mouthY)< 10 &&
        (this.chris.radius-this.displayedObject[i].radius)< 10 &&
        (this.chris.radius-this.displayedObject[i].radius)> 0 &&
        (this.chris.step == this.displayedObject[i].step)
      ){
        var t = this.displayedObject[i];
        this.allTargets.push(t);
        delete this.displayedObject[i];

        this.eatSound = document.createElement('audio');
        this.eatSound.src = "data/s2.mp3";
        this.eatSound.preload = true;
        this.eatSound.loop = false;
        this.eatSound.load();
        document.body.appendChild(this.eatSound);
        this.eatSound.play();
      }

    }
  },

  askForTargetFromMemory:function(){
    if(this.allTargets.length>0){
      var t = this.allTargets.shift();
      t.randomize();
      this.displayedObject[t.ID] = t;
    }
  },


  toggleVolume:function(e){
    var x = e.clientX;
    var y = e.clientY;
    var audio = document.getElementsByTagName("audio")[0];
    var location = JSON.parse(audio.getAttribute('boundaries'));
    console.log(x,y);
    var image = document.getElementById("audioSource");
    //location of icon
    if(x<location.x1 + location.width && y<location.y1 + location.height && x>location.x1 && y>location.y1){
      if(audio.paused){
        audio.play();
        image.src = "data/audioOn.svg";
      } else {
        audio.pause();
        image.src = "data/audioOff.svg";
      }
    }
  },



  draw:function(){

    this.ctx.clearRect(0,0,this.width,this.height);

    if(this.gameOver){
      this.ctx.drawImage(this.gameOverImage, 0, 0, this.width, this.height);
        // if(new Date() - this.gameOverTime > this.gameOverWait){
        //   this.gameOver = false;

        // }

    }else if(this.gameStart == false){
      this.ctx.drawImage(this.gameIntro, 0, 0, this.width, this.height);
      if(new Date() - this.gameStartTime > this.gameStartWait){
        this.gameStart = true;
        this.ctx.drawImage(this.gamePlay, 0, 0, this.width, this.height);
        this.gamePlay = true;

      }

    }else{

      if(this.startingSound){
        this.audioIcon.src = document.getElementById("audioSource").src;
        //this.audioIconLocation
        this.ctx.drawImage(this.audioIcon,this.audioIconLocation.x1 ,this.audioIconLocation.y1, this.audioIconLocation.width, this.audioIconLocation.height);
      }


      if(this.gameOver){this.displayedObject = {};this.deadObjects = []; this.gameOver = false;}

      //draw the ghost
      this.ghost.display();
      this.ghost.displayMouth();
      this.chris.display();
      this.chris.displayMouth();
      //console.log("score =",this.score);

      this.eat();

      for(var i in this.displayedObject){
        this.displayedObject[i].move();
        this.displayedObject[i].display();
        if(this.displayedObject[i].x >=this.width && this.displayedObject[i].isAlive){
            this.displayedObject[i].isAlive = false;
            var newXPosition = (this.deadObjects.length!=0)?this.deadObjects[this.deadObjects.length-1].x +this.deadObjects[this.deadObjects.length-1].radius + this.displayedObject[i].radius:this.displayedObject[i].radius ;

            this.displayedObject[i].x = newXPosition;
            this.displayedObject[i].y = this.height-this.displayedObject[i].radius;
            this.displayedObject[i].speed = -0.1;

            this.deadObjects.push(this.displayedObject[i]);
        }

        if(!this.displayedObject[i].isAlive && this.displayedObject[i].x<=-this.displayedObject[i].radius){
            var t = this.displayedObject[i];

             for(var j=0;j<this.deadObjects.length;j++){
              if(this.deadObjects[j].ID == this.displayedObject[i].ID){
                //console.log("ID TO REMOVE",this.deadObjects[j].ID);
                this.deadObjects.splice(j,1);
              }
            }

            this.allTargets.push(t);
            delete this.displayedObject[i];
        }

        if(this.displayedObject[i]!=undefined){
          //console.log("NEW POSITION", this.displayedObject[i].x,this.width, this.displayedObject[i].isAlive);
          if(this.displayedObject[i].x >=this.width && !this.displayedObject[i].isAlive){
            //alert("you loose !");
             this.gameOver = true;
             this.gameOverTime = new Date();

          }
        }
      }

      if(this.counter%this.limit == 0){
        this.askForTargetFromMemory();
        this.counter = 0;
      }
      this.counter++;
    }



    requestAnimationFrame(this.draw.bind(this));
  }

}
