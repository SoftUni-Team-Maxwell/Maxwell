function GamePlayScene(glContext, canvas) {
  SceneNode.call(this, glContext);
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

  var accum = 0;
  var cooldown = 5;

  //jumping
  var minY = 80;
  var maxY = 660;
  var jumping = false;
  var falling = false;
  var mousePosition = new Vec2(0, 0);


  var playerOptions = {
    sourceRectangle: new Rect(0.75,0.0,0.25,0.25),
    destinationRectangle: new Rect(100,minY,100,100),
    flipX: true
  };

  canvas.addEventListener('mousemove', function(e) {
    var rect = canvas.getBoundingClientRect();
    mousePosition.x = e.clientX - rect.left;
    mousePosition.y = rect.bottom - e.clientY;
  });

  document.body.onmousedown = function() {
    falling = false;
    jumping = true;

  };
  document.body.onmouseup = function() {
    falling = true;
    jumping = false;
  };

  this._updateSelf = function(delta) {
    if (--cooldown < 0) {
      cooldown = 5;
      playerOptions.sourceRectangle.x -= 0.25;
      if (playerOptions.sourceRectangle.x < 0.0) {
        playerOptions.sourceRectangle.x = 0.75;

        playerOptions.sourceRectangle.y += 0.25;
        if (playerOptions.sourceRectangle.y >= 1.0) {
          playerOptions.sourceRectangle.y = 0.0;
        }
      }
    }

    this.background.position.x -= 2;
    this.background2.position.x -= 2;

    if (this.background2.position.x <= 0) {
      this.background.position.x += this.canvas.width;
      this.background2.position.x += this.canvas.width;
    }

    this.ground.position.x -= 5;
    this.ground2.position.x -= 5;

    //Handle jumping
    if (jumping === true) {
      this.tootParticles.Generate(125, playerOptions.destinationRectangle.y + 20);

      if (playerOptions.destinationRectangle.y < maxY) {
        playerOptions.destinationRectangle.y += 7;
      } else {
        jumping = false;
        falling = true;
      }
    } else if (falling) {
      if (playerOptions.destinationRectangle.y > minY) {
        playerOptions.destinationRectangle.y -= 7;
      } else {
        playerOptions.destinationRectangle.y = minY;
        falling = false;
      }
    }

    this.tootParticles.Update(3);
    this.particleEngine.Generate(mousePosition.x, mousePosition.y);
    this.particleEngine.Update(5);


    if (this.ground2.position.x <= 0) {
      this.ground.position.x += canvas.width;
      this.ground2.position.x += canvas.width;
    }
  };

  this._drawSelf = function(batch) {
    batch.drawSprite(this.background);
    batch.drawSprite(this.background2);
    batch.drawSprite(this.ground);
    batch.drawSprite(this.ground2);
    batch.DrawTexture(this.playerSheet, playerOptions);
    this.tootParticles.draw(batch);
    this.particleEngine.draw(batch);
  };

}

GamePlayScene.prototype = Object.create(SceneNode.prototype);

GamePlayScene.prototype.Init = function() {
  var gl = this.gl;
  var canvas = this.canvas;

  var self = this;
  var countToLoad = 7;

  var backgroundImg = new Image();
  backgroundImg.src = "textures/bg.png";
  backgroundImg.onload = function() {
    var backgroundTexture = new Texture(gl, backgroundImg);
    self.background = new Sprite(gl, new Vec3(0, 0, 0), new Vec2(canvas.width, canvas.height), backgroundTexture);
    self.background2 = new Sprite(gl, new Vec3(canvas.width, 0, 0), new Vec2(canvas.width, canvas.height), backgroundTexture);
    countToLoad -= 2;
    if (countToLoad <= 0) {
      this.initialized = true;
    }
  };

  var bubbleImg = new Image();
  bubbleImg.src = "textures/bubble.png";
  bubbleImg.onload = function() {
    var bubbleTexture = new Texture(gl, bubbleImg);
    self.particleEngine = new ParticleEngine(gl, bubbleTexture, 50);
    self.tootParticles = new ParticleEngine(gl, bubbleTexture, 50);
    self.tootParticles.minWidth = 5;
    self.tootParticles.maxWidth = 25;
    self.tootParticles.life = 50;
    self.tootParticles.generationMethod = generateToots;
    self.particleEngine.minWidth = 10;
    self.particleEngine.maxWidth = 50;
    self.particleEngine.life = 25;
    countToLoad -= 2;
    if (countToLoad >= 0) {
      this.initialized = true;
    }
  };

  var groundImg = new Image();
  groundImg.src = 'textures/grass.png';
  groundImg.onload = function() {
    var groundTexture = new Texture(gl, groundImg);
    self.ground = new Sprite(gl, new Vec3(0, 0, 0), new Vec2(canvas.width, 100), groundTexture);
    self.ground2 = new Sprite(gl, new Vec3(canvas.width, 0, 0), new Vec2(canvas.width, 100), groundTexture);
    countToLoad -= 2;
    if (countToLoad <= 0) {
      this.initialized = true;
    }
  };

  var lavaImg = new Image();
  lavaImg.src = 'textures/lava.png';
  lavaImg.onload = function() {
    var lavaTexture = new Texture(gl, lavaImg);
    self.lava = new Sprite(gl, new Vec3(0, 0, 0), new Vec2(canvas.width, 100), lavaTexture);
    if (--countToLoad >= 0) {
      this.initialized = true;
    }
  };

  var playerImg = new Image();
  playerImg.src = 'textures/playerSprite2.png';
  playerImg.onload = function() {
    self.playerSheet = new Texture(gl, playerImg);
    if (--countToLoad >= 0) {
      this.initialized = true;
    }
  };
};


GamePlayScene.prototype.UpdateSelf = function(delta) {
  this._updateSelf(delta);
};

GamePlayScene.prototype.DrawSelf = function(batch) {
  this._drawSelf(batch);
};

function generateToots(x, y) {
  if (this.particles.length > this.maxCount) {
    return false;
  }
  var _x, _y;

  if (x instanceof Vec2) {
    _x = x.x;
    _y = x.y;
  } else {
    _x = x;
    _y = y;
  }


  var particles = this.particles;
  var count = this.maxCount;

  var width = getRandomInt(this.minWidth, this.maxWidth);
  var dirX = getRandomInt(-100, -50) / 100.0;
  var dirY = getRandomInt(-100, 0) / 100.0;
  var directionNormalized = new Vec2(dirX, dirY);
  directionNormalized.normalize();
  var colorR = getRandomInt(0, 255);
  var colorG = getRandomInt(0, 255);
  var colorB = getRandomInt(0, 255);
  var colorA = 155;

  var color = (colorA << 24) | (colorB << 16) | (colorG << 8) | colorR;

  var p = new Particle(_x, _y, width, width, directionNormalized, this.life, color);
  particles.push(p);
  return true;
}
