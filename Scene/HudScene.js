function HudScene(glContext){
  SceneNode.call(this,glContext);
  var self = this;
  this.score = 0;
  this.optionsButton = null;
  this.pauseButton = null;
  this.mousePosition = null;
  this.font = null;
  this.gameOverFont = null;
  this.gameOverTrigger = false;

  this.selectedFontOptions = {
    scaleX: 0.75,
    scaleY: 0.75,
    rotation: 0,
    color: 0x00ff3377,
    outlineColor: 0x00110000,
    smoothing: 1,
    depth: 99,
    destinationC: 0xff0000aa,
    originalC: 0xff000000,
    //keepShader: true
  };

  this.normalFontOptions = {
    scaleX: 0.75,
    scaleY: 0.75,
    rotation: 0,
    color: 0x00333333,
    smoothing: 0.1,
    depth: 99,
    //keepShader: true
  };
  this.scoreFontOptions = {
    scaleX: 0.55,
    scaleY: 0.55,
    color: 0xff000000,
    depth: 99,
    outlineColor: 0xffffffff,
    smoothing: 0.05,
    //keepShader: true
  };
  this.fontOptions = {
    scaleX : 0.55,
    scaleY : 0.55,
    color : 0xff000000,
    depth: 99,
    outlineColor : 0xffffffff,
    smoothing : 0.05
  };
  this.pauseFontOptions = {
    scaleX: 1.25,
    scaleY: 1.25,
    color: 0x00111111,
    depth: 99,
    outlineColor: 0x00dd9933,
    smoothing: 0.2,
    //keepShader: true
  };
  this.paused = false;
  this.transitionFadeIn = new Transition(0,500);
  this.transitionFadeOut = new Transition(0,500);

  this.menuValues = [
    {
    text: 'Sound volume',
    xWidth: 0,
    value: ASSETMANAGER.SoundVolume,
    position: new Vec3(0, 350, 0)
    },
    {
    text: 'Music volume',
    xWidth: 0,
    value: ASSETMANAGER.SongVolume,
    position: new Vec3(0, 300, 0)
    },
    {
    text: 'Exit',
    xWidth: 0,
    value: ASSETMANAGER.SongVolume,
    position: new Vec3(0, 250, 0)
    },
  ];

  this.transitionFadeIn.onUpdate = function(delta,percent){
    var amount = (percent / 100 * 255) | 0;
    if (100 - percent > 50) {
      self.gl.defaultShader.setUniformf((100 - percent)/ 100, self.gl.defaultShader.uLocations.uFade);
    }
    self.pauseFontOptions.color = setChannel(self.pauseFontOptions.color, 'a', amount);
    self.normalFontOptions.color = setChannel(self.normalFontOptions.color, 'a', amount);
    self.selectedFontOptions.color = setChannel(self.selectedFontOptions.color, 'a', amount);
    self.pauseFontOptions.outlineColor = setChannel(self.pauseFontOptions.outlineColor, 'a', amount);
    self.selectedFontOptions.outlineColor = setChannel(self.selectedFontOptions.outlineColor, 'a', amount);
  };

  this.transitionFadeOut.onUpdate = function(delta,percent){
    var amount = ((100 - percent) / 100 * 255) | 0;
    if (percent > 50) {
      self.gl.defaultShader.setUniformf(percent/ 100, self.gl.defaultShader.uLocations.uFade);
    }
    self.pauseFontOptions.color = setChannel(self.pauseFontOptions.color, 'a', amount);
    self.normalFontOptions.color = setChannel(self.normalFontOptions.color, 'a', amount);
    self.selectedFontOptions.color = setChannel(self.selectedFontOptions.color, 'a', amount);
    self.pauseFontOptions.outlineColor = setChannel(self.pauseFontOptions.outlineColor, 'a', amount);
    self.selectedFontOptions.outlineColor = setChannel(self.selectedFontOptions.outlineColor, 'a', amount);
  };

  this.transitionFadeIn.onFinish = transitionFinish;
  this.transitionFadeOut.onFinish = transitionFinish;


  function transitionFinish(){
    if (self.paused || self.gameOverTrigger) {
      self.EnableListeners();
    } else {
      self.DisableListeners(['click']);
    }
    console.log('Tran sition finish');
    self.transitioning = false;
  }
}

HudScene.prototype = Object.create(SceneNode.prototype);

HudScene.prototype.Init = function(){
  if (this.initialized) {
    return;
  }
  var self = this;
  var normal = new Sprite(new Vec3(0,0,-100),new Vec2(50,50),ASSETMANAGER.textures.pauseButton);
  normal.color = 0xaaaaaaaa;
  var hover = new Sprite(new Vec3(0,0,-100),new Vec2(50,50),ASSETMANAGER.textures.pauseButton);
  hover.color = 0xffffffff;
  var click = new Sprite(new Vec3(0,0,-100),new Vec2(50,50),ASSETMANAGER.textures.pauseButton);
  click.color = 0xffaaaaaa;
  this.font = ASSETMANAGER.fonts.default;
  this.gameOverFont = ASSETMANAGER.fonts.cooperB;
  this.pauseFontOptions.sizeX = this.gameOverFont.MeasureString('Paused').x;

  for (var i = 0; i < this.menuValues.length; i++) {
    this.menuValues[i].xWidth = this.gameOverFont.MeasureString(this.menuValues[i].text).x;
    this.menuValues[i].position.x = CANVAS.width / 2 - (this.menuValues[i].xWidth * this.normalFontOptions.scaleX)/ 2;
  }

  this.optionsButton = new Button(normal,hover,click);
  this.optionsButton.depth = 100;
  this.optionsButton.position = new Vec3(CANVAS.width - 55,CANVAS.height - 55,100);

  this.AddListener(CANVAS, 'click', function(e) {
    self.optionsButton.onClick();
  });

  this.AddListener(window, 'keydown', menuHandler);
  this.selectedIndex = 0;

  function menuHandler(e) {
    console.log(e);
    switch (e.keyCode) {
      case 40: // Down
        if (self.selectedIndex < 2) {
          self.selectedIndex++;
        }
        break;
      case 38: // Up
        if (self.selectedIndex > 0) {
          self.selectedIndex--;
        }
        break;
      case 37: // Left
        switch (self.selectedIndex) {
          case 0:
            ASSETMANAGER.SoundVolume -= 0.1;
            self.menuValues[self.selectedIndex].value = ASSETMANAGER.SoundVolume;
            break;
          case 1:
            ASSETMANAGER.SongVolume -= 0.1;
            self.menuValues[self.selectedIndex].value = ASSETMANAGER.SongVolume;
            break;
          default:

        }
        break;
      case 39: // Right
        switch (self.selectedIndex) {
          case 0:
            ASSETMANAGER.SoundVolume += 0.1;
            self.menuValues[self.selectedIndex].value = ASSETMANAGER.SoundVolume;
            break;
          case 1:
            ASSETMANAGER.SongVolume += 0.1;
            self.menuValues[self.selectedIndex].value = ASSETMANAGER.SongVolume;
            break;
          default:

        }
        break;
      case 27:
          if (self.paused) {
            self.optionsButton.Action();
          }
        break;
      case 13:
        if (self.selectedIndex === 2) {
          var scene = new SplashScreenScene(GL);
          scene.Init();
          ASSETMANAGER.PlaySong('menu',true,1000,500);
          self.DisableListeners();
          var sm = self.parent.sceneManager;
          setTimeout(function(){
            sm.ChangeScene(scene);
          },750);
        }
        break;
      default:

    }
  }

  this.optionsButton.Action = function(){
    self.parent.pause = !self.parent.pause;
    self.paused = !self.paused;
    if (self.paused) {
      self.transitioning = true;
      self.transitionFadeOut.Stop();
      self.transitionFadeIn.CurrentPosition = self.transitionFadeOut.CurrentPosition;
      self.transitionFadeIn.Restart();
    }else if(!self.paused){
      self.transitioning = true;
      self.transitionFadeIn.Stop();
      self.transitionFadeOut.CurrentPosition = self.transitionFadeIn.CurrentPosition;
      self.transitionFadeOut.Restart();
    }
  };
  self.initialized = true;
};

HudScene.prototype.DrawSelf = function(batch){
  var self = this;
  batch.drawString(this.font,this.score.toString(),CANVAS.width - 150,50,this.fontOptions);
  this.optionsButton.Draw(batch);
  if (self.transitioning || self.paused || self.gameOverTrigger) {
    self.gl.defaultFontShader.setUniformf(1, self.gl.defaultFontShader.uLocations.uFade);
    if(self.parent.gameOver){
      batch.drawString(ASSETMANAGER.fonts.cooperB,'Game Over',CANVAS.width/2 - (self.pauseFontOptions.sizeX * 1.25) / 2,450,self.pauseFontOptions);
    }
    else{
      batch.drawString(ASSETMANAGER.fonts.cooperB,'Paused',CANVAS.width/2 - (self.pauseFontOptions.sizeX * 1.25) / 2,450,self.pauseFontOptions);

    }
    for (var i = 0; i < self.menuValues.length; i++) {
      var c = self.menuValues[i];
      if (self.selectedIndex === i) {
        batch.drawString(ASSETMANAGER.fonts.cooperB, c.text,c.position.x, c.position.y, self.selectedFontOptions);
      }else {
        batch.drawString(ASSETMANAGER.fonts.cooperB, c.text,c.position.x, c.position.y, self.normalFontOptions);
      }
      if (self.selectedIndex === i && i !== 2) {
        batch.drawLine(c.position.x + 20,c.position.y - 50, c.position.x + 20 + (c.xWidth * self.normalFontOptions.scaleX * c.value),c.position.y - 50,{color:0xffff3377,depth:99});
      }
    }
  }
};


HudScene.prototype.UpdateSelf = function(delta){
  var self = this;
  if(self.parent.gameOver && !self.gameOverTrigger){
    self.gameOverTrigger = true;
    self.pauseFontOptions.sizeX = self.gameOverFont.MeasureString('Game Over').x;
    self.transitioning = true;
    self.transitionFadeOut.Stop();
    self.transitionFadeIn.CurrentPosition = self.transitionFadeOut.CurrentPosition;
    self.transitionFadeIn.Restart();
  }
  if (this.transitionFadeIn.active && !this.transitionFadeIn.finished) {
    this.transitionFadeIn.Update(delta);
  }
  if (this.transitionFadeOut.active && !this.transitionFadeOut.finished) {
    this.transitionFadeOut.Update(delta);
  }
  this.optionsButton.Hovered(this.mousePosition.x,this.mousePosition.y);
};
