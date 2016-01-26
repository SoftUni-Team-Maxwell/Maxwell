function HudScene(glContext){
  SceneNode.call(this,glContext);

  this.score = 0;
  this.optionsButton = null;
  this.pauseButton = null;
  this.mousePosition = null;
  this.font = null;
  this.fontOptions = {
    scaleX : 0.55,
    scaleY : 0.55,
    color : 0xff000000,
    outlineColor : 0xffffffff,
    smoothing : 0.05
  };

}

HudScene.prototype = Object.create(SceneNode.prototype);

HudScene.prototype.Init = function(){
  if (this.initialized) {
    return;
  }
  var self = this;
  var normal = new Sprite(new Vec3(0,0,10),new Vec2(50,50),ASSETMANAGER.textures.pauseButton);
  normal.color = 0xaaaaaaaa;
  var hover = new Sprite(new Vec3(0,0,10),new Vec2(50,50),ASSETMANAGER.textures.pauseButton);
  hover.color = 0xffffffff;
  var click = new Sprite(new Vec3(0,0,10),new Vec2(50,50),ASSETMANAGER.textures.pauseButton);
  click.color = 0xffaaaaaa;
  this.font = ASSETMANAGER.fonts.default;

  this.optionsButton = new Button(normal,hover,click);
  this.optionsButton.position = new Vec3(CANVAS.width - 55,CANVAS.height - 55,100);
  this.AddListener(CANVAS,'mousedown',function(e){
    self.optionsButton.onMouseDown();
  });
  this.AddListener(CANVAS,'mouseup',function(e){
    self.optionsButton.onMouseUp();
  });
  this.optionsButton.Action = function(){
    self.parent.pause = !self.parent.pause;
  };
  self.initialized = true;
};

HudScene.prototype.DrawSelf = function(batch){
  // function(spritefont,string,x,y,options){
  batch.drawString(this.font,this.score.toString(),CANVAS.width - 150,50,this.fontOptions);
  this.optionsButton.Draw(batch);
};

HudScene.prototype.UpdateSelf = function(delta){
  this.optionsButton.Hovered(this.mousePosition.x,this.mousePosition.y);
};
