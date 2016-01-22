var quad;
function SplashScreenScene(gl) {
  // NOTE(Inspix): Initialize baseclass members
  SceneNode.call(this, gl);
  // NOTE(Inspix): Non baseclass members
  this.background = null;
  this.logo = null;
  this.position = new Vec3(0, 0, 0);
  this.timeOnScreen = 100;
  this.font = null;
  this.bubbleGenerator = null;
}

// NOTE(Inspix): Inherit from base object SceneNode
SplashScreenScene.prototype = Object.create(SceneNode.prototype);

// NOTE(Inspix): Override DrawSelf function of the base class
SplashScreenScene.prototype.DrawSelf = function(batch) {
  if (this.initialized) {
    batch.drawSprite(this.background);
    batch.drawSprite(this.logo);
    MenuDraw(this.font);
  }
};

// NOTE(Inspix): Override Update function of the base class
SplashScreenScene.prototype.UpdateSelf = function(delta) {
  if (this.initialized) {
    this.background.rotation = 0;
    logoRotation(this.logo);
    if (stringOptions.outlineColor >>> 0 === stringOptions.destinationC >>> 0) {
      var temp = stringOptions.destinationC;
      stringOptions.destinationC = stringOptions.originalC;
      stringOptions.originalC = temp;
    }
    stringOptions.outlineColor = smoothTransition(stringOptions.outlineColor,stringOptions.destinationC, 5);
  }

};

// NOTE(Inspix): Override onFinish function of the base class
// Can be used to triger a transition to another scene or event
SplashScreenScene.prototype.onFinish = function() {
  console.log("Scene Finished");
};

// NOTE(Inspix): Override Init function of the base class
// use to load all needed assets for the current Scene.
SplashScreenScene.prototype.Init = function() {
  var gl = this.gl;
  var self = this;

  var backgroundImg = new Image();
  backgroundImg.onload = function() {
    self.backgroundTexture = new Texture(gl, backgroundImg);
    self.background = new Sprite(gl, new Vec3(0, 0, 0), new Vec2(CANVAS.width, CANVAS.height), self.backgroundTexture);
    self.initialized = true;
  };
  backgroundImg.src = 'textures/bg.png';
  var logoImg = new Image();
  logoImg.onload = function() {
    self.logoTexture = new Texture(gl, logoImg);
    self.logo = new Sprite(gl, new Vec3(CANVAS.width / 3.2 - 10, CANVAS.height / 1.5, 0), new Vec2(400, 170), self.logoTexture);
    self.initialized = true;
  };
  logoImg.src = 'textures/logo.png';
  this.font = new SpriteFont(gl, 'fonts/CooperBlackItalic.fnt');
};

function logoRotation(logo) {
  if (logo.position.x < CANVAS.width / 3.2 || logo.position.x > CANVAS.width / 3.2 + 10) {
    logo.position.x -= 10;
    if (logo.position.x <= -400) {
      logo.position.x = CANVAS.width;
    }
  }
}

var stringOptions = {
  scaleX: 0.75,
  scaleY: 1.0,
  rotation: 0,
  color: 0xff0000ff,
  outlineColor: 0xffffffff,
  smoothing: 0.1,
  depth: 100,
  destinationC: 0xffff5555,
  originalC: 0xff000000
};

var selectedOption = {
  scaleX: 0.75,
  scaleY: 1,
  rotation: 0,
  color: 0xff000000,
  smoothing: 0.1,
  depth: 100
};

var stringSize;
var menuOptions = ['New Game', 'About Us', 'Exit'];
var selectedOptionMenu = 0;

function MenuDraw(font) {
  if (font.initialized) {
    if (!stringSize) {
      stringSize = font.MeasureString('TEst font');
      stringSize.x *= 0.75;
    }
    var lineSpacing = 400;
    for (var i = 0; i < menuOptions.length; i++) {
      if (i === selectedOptionMenu) {
        batch.drawString(font, menuOptions[i], CANVAS.width / 2 - (stringSize.x || 1) + 10, lineSpacing, stringOptions);
      } else {
        batch.drawString(font, menuOptions[i], CANVAS.width / 2 - (stringSize.x || 1) + 10, lineSpacing, selectedOption);
      }

      lineSpacing -= 75;
    }
  }
}
