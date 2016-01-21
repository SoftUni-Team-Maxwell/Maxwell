function GamePlayScene(gl,canvas){
  SceneNode.call(this,gl);
  this.background = null;
  this.background2 = null;
  this.ground = null;
  this.ground2 = null;
  this.lava = null;
  this.playerSheet = null;
  this.particleEngine = null;
  this.tootParticles = null;
  this.canvas = canvas;


  /*------------------- Private Logic -------------*/
  var row = 0.75;
  var col = 0.75;
  var accum = 0;
  var cooldown = 5;

  //jumping
  var minY = 80;
  var maxY = 660;
  var currentY = minY;
  var jumping = false;
  var falling = false;
  var mousePosition = new Vec2(0,0);

  canvas.addEventListener('mousemove', function(e) {
    var rect = canvas.getBoundingClientRect();
    mousePosition.x = e.clientX - rect.left;
    mousePosition.y = rect.bottom - e.clientY;
  });

  document.body.onmousedown = function() {
    falling=false;
    jumping=true;

  };
  document.body.onmouseup = function() {
    falling=true;
    jumping=false;
  };

  this._updateSelf = function(delta){
    if (--cooldown < 0) {
      cooldown = 5;
      col -= 0.25;
      if (col < 0.0) {
        col = 0.75;

        row += 0.25;
        if (row >= 1.0) {
          row = 0;
        }
      }
    }

    this.background.position.x -= 2;
    this.background2.position.x -= 2;

    if (this.background2.position.x <= 0) {
      this.background.position.x += this.canvas.width;
      this.background2.position.x += this.canvas.width;
    }

    this.ground.position.x-=5;
    this.ground2.position.x-=5;

    //Handle jumping
    if(jumping===true){
      this.tootParticles.Generate(125,currentY + 20);

      if(currentY<maxY){
        currentY+=7;
      }
      else{
        jumping=false;
        falling=true;
      }
    }else if(falling){
      if(currentY>minY){
        currentY-=7;
      }
      else{
        currentY = minY;
        falling=false;
      }
    }

    this.tootParticles.Update(3);
    this.particleEngine.Generate(mousePosition.x, mousePosition.y);
    this.particleEngine.Update(5);


    if (this.ground2.position.x<=0) {
        this.ground.position.x += canvas.width;
        this.ground2.position.x += canvas.width;
    }
  };

  this._drawSelf = function(batch){
    batch.drawSprite(this.background);
    batch.drawSprite(this.background2);
    batch.drawSprite(this.ground);
    batch.drawSprite(this.ground2);
    batch.drawTexture(this.playerSheet,new Rect(col,row,0.25,0.25),new Rect(100,currentY,100,100),0,0xffffffff,1,50,50,true);
    this.tootParticles.draw(batch);
    this.particleEngine.draw(batch);
  };

}

GamePlayScene.prototype = Object.create(SceneNode.prototype);

GamePlayScene.prototype.Init = function(){
  var canvas = this.canvas;

  var self = this;
  var countToLoad = 7;

  var backgroundImg = new Image();
  backgroundImg.src = "textures/bg.png";
  backgroundImg.onload = function(){
    var backgroundTexture = new Texture(gl,backgroundImg);
    self.background = new Sprite(gl,new Vec3(0,0,0),new Vec2(canvas.width,canvas.height),backgroundTexture);
    self.background2 = new Sprite(gl,new Vec3(canvas.width,0,0),new Vec2(canvas.width,canvas.height),backgroundTexture);
    countToLoad -= 2;
    console.log(countToLoad);
    if (countToLoad <= 0) {
      this.initialized = true;
    }
  };

  var bubbleImg = new Image();
  bubbleImg.src = "textures/bubble.png";
  bubbleImg.onload = function(){
    var bubbleTexture = new Texture(gl,bubbleImg);
    self.particleEngine = new ParticleEngine(gl,bubbleTexture,50);
    self.tootParticles = new ParticleEngine(gl,bubbleTexture,50);
    self.tootParticles.minWidth = 5;
    self.tootParticles.maxWidth = 25;
    self.tootParticles.life = 50;
    self.tootParticles.generationMethod = generateToots;
    self.particleEngine.minWidth = 10;
    self.particleEngine.maxWidth = 50;
    self.particleEngine.life = 25;
    countToLoad -= 2;
    console.log(countToLoad);
    if (countToLoad >= 0) {
      this.initialized = true;
    }
  };

  var groundImg = new Image();
  groundImg.src='textures/grass.png';
  groundImg.onload = function(){
    var groundTexture = new Texture(gl,groundImg);
    self.ground = new Sprite(gl,new Vec3(0,0,0),new Vec2(canvas.width,100),groundTexture);
    self.ground2 = new Sprite(gl,new Vec3(canvas.width,0,0),new Vec2(canvas.width,100),groundTexture);
    countToLoad -= 2;
    console.log(countToLoad);
    if (countToLoad <= 0) {
      this.initialized = true;
    }
  };

  var lavaImg = new Image();
  lavaImg.src = 'textures/lava.png';
  lavaImg.onload = function(){
    var lavaTexture = new Texture(gl,lavaImg);
    self.lava = new Sprite(gl,new Vec3(0,0,0),new Vec2(canvas.width,100),lavaTexture);
    console.log(countToLoad);
    if (--countToLoad >= 0) {
      this.initialized = true;
    }
  };

  var playerImg = new Image();
  playerImg.src = 'textures/playerSprite2.png';
  playerImg.onload = function(){
    self.playerSheet = new Texture(gl,playerImg);
    console.log(countToLoad);
    if (--countToLoad >= 0) {
      this.initialized = true;
    }
  };
};


GamePlayScene.prototype.UpdateSelf = function(delta){
  this._updateSelf(delta);
};

GamePlayScene.prototype.DrawSelf = function(batch){
  this._drawSelf(batch);
};

function generateToots(x,y){
  if (this.particles.length > this.maxCount) {
    return false;
  }
  var _x,_y;

  if (x instanceof Vec2) {
    _x = x.x;
    _y = x.y;
  }else {
    _x = x;
    _y = y;
  }


  var particles = this.particles;
  var count = this.maxCount;

  var width = getRandomInt(this.minWidth,this.maxWidth);
  var dirX = getRandomInt(-100,-50) / 100.0;
  var dirY = getRandomInt(-100,0) / 100.0;
  var directionNormalized = new Vec2(dirX,dirY);
  directionNormalized.normalize();
  var colorR = getRandomInt(0,255);
  var colorG = getRandomInt(0,255);
  var colorB = getRandomInt(0,255);
  var colorA = 155;

  var color = (colorA << 24 ) | (colorB << 16) | (colorG << 8) | colorR;
  console.log(color.toString(16));
  //function Particle(x,y,width,height,vec2direction,life,color){

  var p = new Particle(_x,_y,width,width,directionNormalized,this.life,color);
  particles.push(p);
  return true;
}
