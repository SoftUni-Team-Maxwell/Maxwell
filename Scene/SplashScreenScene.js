function SplashScreenScene(gl) {
  // NOTE(Inspix): Initialize baseclass members
  SceneNode.call(this, gl);
  // NOTE(Inspix): Non baseclass members
  var self = this;
  this.background = null;
  this.logo = null;
  this.position = new Vec3(0, 0, 0);
  this.timeOnScreen = 100;
  this.font = null;
  this.bubbleGenerator = null;

  this.stringOptions = {
    scaleX: 0.75,
    scaleY: 1.0,
    rotation: 0,
    color: 0x000000ff,
    outlineColor: 0x00110000,
    smoothing: 0.1,
    depth: 100,
    destinationC: 0xffff5555,
    originalC: 0xff000000
  };

  this.selectedOption = {
    scaleX: 0.75,
    scaleY: 1,
    rotation: 0,
    color: 0x00110000,
    smoothing: 0.1,
    depth: 100
  };

  this.transitionMenu = new Transition(0,1000);
  this.transitionMenu.onUpdate = function(delta,percent){
    var amount = ((percent / 100) * 255) | 0;
    console.log(amount);
    var ccolor = self.selectedOption.color;
    self.selectedOption.color = amount << 24 | (ccolor & 0xff0000) << 16 | (ccolor & 0xff00) << 8 | (ccolor & 0xff);
    ccolor = self.stringOptions.color;
    self.stringOptions.color = amount << 24 | (ccolor & 0xff0000) << 16 | (ccolor & 0xff00) << 8 | (ccolor & 0xff);
    ccolor = self.stringOptions.outlineColor;
    self.stringOptions.outlineColor = amount << 24 | (ccolor & 0xff0000) << 16 | (ccolor & 0xff00) << 8 | (ccolor & 0xff);
  };

  this.AddListener(window, 'keydown', KeyInput);

  this.menuOptions = ['New Game', 'About Us', 'Exit'];
  this.menuWidths = [];
  this.selectedMenu = 0;


  function KeyInput(e) {
    console.log("KeyInput");
    console.log(this);
    switch (e.keyCode) {
      case 13:
        switch (self.selectedMenu) {
          case 0:
            self.sceneManager.ChangeScene('GamePlay');
            break;
          case 1:
            break;
          case 2:
            break;
        }
        break;
      case 40:
        console.log(self.selectedMenu);
        if (self.selectedMenu < 2) {
          self.selectedMenu++;
          console.log(self.selectedMenu);
        }
        break;
      case 38:
        if (self.selectedMenu > 0) {
          self.selectedMenu--;
          console.log(self.selectedMenu);
        }
        break;
    }
  }
}

// NOTE(Inspix): Inherit from base object SceneNode
SplashScreenScene.prototype = Object.create(SceneNode.prototype);

// NOTE(Inspix): Override DrawSelf function of the base class
SplashScreenScene.prototype.DrawSelf = function(batch) {
  if (this.initialized) {
    batch.drawSprite(this.background);
    batch.drawSprite(this.logo);
    this.DrawMenu();
  }
};

// NOTE(Inspix): Override Update function of the base class
SplashScreenScene.prototype.UpdateSelf = function(delta) {
  if (this.initialized) {
    this.background.rotation = 0;
    this.LogoRotation();
    if (this.transitionMenu.finished) {
      if (this.stringOptions.outlineColor >>> 0 === this.stringOptions.destinationC >>> 0) {
        var temp = this.stringOptions.destinationC;
        this.stringOptions.destinationC = this.stringOptions.originalC;
        this.stringOptions.originalC = temp;
      }
      this.stringOptions.outlineColor = smoothTransition(this.stringOptions.outlineColor, this.stringOptions.destinationC, 5);
    }
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
  var self = this;

  self.background = new Sprite(new Vec3(0, 0, 0), new Vec2(CANVAS.width, CANVAS.height), ASSETMANAGER.textures.background);
  self.logo = new Sprite(new Vec3((CANVAS.width / 2 - 400 / 2) - 20, CANVAS.height - 200, 0), new Vec2(400, 170), ASSETMANAGER.textures.logo);
  this.font = ASSETMANAGER.fonts.cooperBI;
  for (var i = 0; i < this.menuOptions.length; i++) {
    this.menuWidths.push(this.font.MeasureString(this.menuOptions[i]).x * 0.75);
  }
  this.initialized = true;
};

SplashScreenScene.prototype.LogoRotation = function() {
  var center = CANVAS.width / 2 - this.logo.width / 2;
  if (this.logo.position.x < center - 10 || this.logo.position.x > center + 20) {
    this.logo.position.x -= 10;
    if (this.logo.position.x <= -400) {
      this.logo.position.x = CANVAS.width;
    }
  }else{
    if (!this.transitionMenu.active && !this.transitionMenu.finished) {
      this.transitionMenu.Start();
    }else if (this.transitionMenu.active && !this.transitionMenu.finished) {
      this.transitionMenu.Update(1);
    }
  }
};

SplashScreenScene.prototype.DrawMenu = function() {
  var font = this.font;
  if (font.initialized) {
    var lineSpacing = 350;
    for (var i = 0; i < this.menuOptions.length; i++) {
      if (i === this.selectedMenu) {
        batch.drawString(font, this.menuOptions[i], CANVAS.width / 2 - this.menuWidths[i] / 2, lineSpacing, this.stringOptions);
      } else {
        batch.drawString(font, this.menuOptions[i], CANVAS.width / 2 - this.menuWidths[i] / 2, lineSpacing, this.selectedOption);
      }

      lineSpacing -= 75;
    }
  }
};
