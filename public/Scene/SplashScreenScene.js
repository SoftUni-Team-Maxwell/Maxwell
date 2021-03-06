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
    color: 0x00ff3377,
    outlineColor: 0x00110000,
    smoothing: 0.1,
    depth: 100,
    destinationC: 0xff0000aa,
    originalC: 0xff000000
  };

  this.selectedOption = {
    scaleX: 0.75,
    scaleY: 1,
    rotation: 0,
    color: 0x00333333,
    smoothing: 0.1,
    depth: 100
  };

  this.transitionMenu = new Transition(0,1000);
  this.transitionMenu.onUpdate = function(delta,percent){
    var amount = ((percent / 100) * 255) | 0;
    self.selectedOption.color = setChannel(self.selectedOption.color,'a',amount);
    self.stringOptions.color = setChannel(self.stringOptions.color,'a',amount);
    self.stringOptions.outlineColor = setChannel(self.stringOptions.outlineColor,'a',amount);
  };

  this.AddListener(window, 'keydown', KeyInput);

  this.offset = 0;
  this.about = false;
  this.aboutMoved = false;
  this.menuOptions = ['New Game', 'About Us', 'Exit'];

  this.aboutOptions = [
    {
      text:'Inspix',
      texture: ASSETMANAGER.textures.Inspix,
      options:
      {
        destinationRectangle: new Rect(1550,300,100,100),
      },
      textPosition: new Vec3(1675,375,0),
    },
    {
      text:'Bozhidar Tonchev',
      texture: ASSETMANAGER.textures.Bojidar,
      options:
      {
        destinationRectangle: new Rect(2450,215,100,100),
      },
      textPosition: new Vec3(1825,295,0),
    },
    {
      text:'nedyalkovV',
      texture: ASSETMANAGER.textures.Vasko,
      options:
      {
        destinationRectangle: new Rect(1675,115,100,100),
      },
      textPosition: new Vec3(1800,200,0),
    },
    {
      text:'craghagBg',
      texture: ASSETMANAGER.textures.Ivaylo,
      options:
      {
        destinationRectangle: new Rect(2350,50,100,100),
      },
      textPosition: new Vec3(1975,125,0),
    }
  ];
  this.menuWidths = [];
  this.selectedMenu = 0;
  this.aboutSelectedIndex = 0;


  function KeyInput(e) {
    if (!self.transitionMenu.finished) return;

    switch (e.keyCode) {
      case 13:
        if (self.about) {
          break;
        }
        switch (self.selectedMenu) {
          case 0:
            var transition = new Transition(0,3000);
            transition.onUpdate = function(delta,percent){
              var value = (100 - percent)/ 100;
              self.gl.defaultShader.setUniformf(value,self.gl.defaultShader.uLocations.uFade);
              self.gl.defaultFontShader.setUniformf(value,self.gl.defaultFontShader.uLocations.uFade);
            };
            transition.onFinish = function(){
              self.sceneManager.currentTransition = null;
            };
            self.sceneManager.currentTransition = transition;
            var scene = new GamePlayScene(GL,CANVAS);
            scene.Init();
            self.sceneManager.ChangeScene(scene);

            ASSETMANAGER.PlaySound('select');

            break;
          case 1:
            self.about = true;
            break;
          case 2:
            break;
        }
        break;
      case 27:
        if (self.about) self.about = false;
        break;
      case 40:
        if (self.about) {
          if (self.aboutSelectedIndex < 3) {
            self.aboutSelectedIndex++;
            ASSETMANAGER.PlaySound('click');
          }
        }else if (self.selectedMenu < 2) {
          self.selectedMenu++;
          ASSETMANAGER.PlaySound('click');
        }
        break;
      case 38:
        if (self.about) {
          if (self.aboutSelectedIndex > 0) {
            self.aboutSelectedIndex--;
            ASSETMANAGER.PlaySound('click');
          }
        }else if (self.selectedMenu > 0) {
          self.selectedMenu--;
          ASSETMANAGER.PlaySound('click');
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
    this.LogoRotation(delta);
    if (this.about && !this.aboutMoved) {
      this.offset-= 25 * delta;
      if (this.offset <= -1500) {
        this.offset = -1500;
        this.aboutMoved = true;
      }
    }
    if (!this.about && this.aboutMoved) {
      this.offset+= 25 * delta;
      if (this.offset >= 0) {
        this.offset = 0;
        this.aboutMoved = false;
      }
    }
    if (this.transitionMenu.finished) {
      if (this.stringOptions.outlineColor >>> 0 === this.stringOptions.destinationC >>> 0) {
        var temp = this.stringOptions.destinationC;
        this.stringOptions.destinationC = this.stringOptions.originalC;
        this.stringOptions.originalC = temp;
      }
      this.stringOptions.outlineColor = smoothTransition(this.stringOptions.outlineColor, this.stringOptions.destinationC, 5 * delta);
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

SplashScreenScene.prototype.LogoRotation = function(delta) {
  var center = CANVAS.width / 2 - this.logo.width / 2;
  if (this.logo.position.x < center - 10 || this.logo.position.x > center + 20) {
    this.logo.position.x -= 10 * delta;
    if (this.logo.position.x <= -400) {
      this.logo.position.x = CANVAS.width;
    }
  }else{
    if (!this.transitionMenu.active && !this.transitionMenu.finished) {
      this.transitionMenu.Start();
    }else if (this.transitionMenu.active && !this.transitionMenu.finished) {
      this.transitionMenu.Update(delta);
    }
  }
};

SplashScreenScene.prototype.DrawMenu = function() {
  var font = this.font;
  var lineSpacing = 350;
  for (var i = 0; i < this.menuOptions.length; i++) {
    if (i === this.selectedMenu) {
      batch.drawString(font, this.menuOptions[i], (CANVAS.width / 2 - this.menuWidths[i] / 2) + this.offset, lineSpacing, this.stringOptions);
    } else {
      batch.drawString(font, this.menuOptions[i], (CANVAS.width / 2 - this.menuWidths[i] / 2) + this.offset, lineSpacing, this.selectedOption);
    }

    lineSpacing -= 75;
  }
  if (this.about || this.aboutMoved) {
    for (var j = 0; j < this.aboutOptions.length; j++) {
      var c = this.aboutOptions[j];
      if (j === this.aboutSelectedIndex) {
        batch.drawString(font, c.text, c.textPosition.x + this.offset, c.textPosition.y, this.stringOptions);
      }else {
        batch.drawString(font, c.text, c.textPosition.x + this.offset, c.textPosition.y, this.selectedOption);
      }
      var options = {
        destinationRectangle: c.options.destinationRectangle.Clone()
      };
      options.destinationRectangle.x += this.offset;
      if (j === this.aboutSelectedIndex) {
        options.destinationRectangle.x -= 5;
        options.destinationRectangle.y -= 5;
        options.destinationRectangle.width += 10;
        options.destinationRectangle.height += 10;
      }
      batch.DrawTexture(c.texture,options);
    }
  }
};
