function SplashScreenScene(gl){
  // NOTE(Inspix): Initialize baseclass members
  SceneNode.call(this,gl);

  // NOTE(Inspix): Non baseclass members
  this.sprite = null;
  this.position = new Vec3(30,30,10);
  this.timeOnScreen = 100;
}

// NOTE(Inspix): Inherit from base object SceneNode
SplashScreenScene.prototype = Object.create(SceneNode.prototype);

// NOTE(Inspix): Override DrawSelf function of the base class
SplashScreenScene.prototype.DrawSelf = function(batch){
  if (this.initialized) {
    batch.drawSprite(this.sprite);
  }
};

// NOTE(Inspix): Override Update function of the base class
SplashScreenScene.prototype.UpdateSelf = function(delta){

  if (this.initialized) {
    this.sprite.rotation++;
  }
};

// NOTE(Inspix): Override onFinish function of the base class
// Can be used to triger a transition to another scene or event
SplashScreenScene.prototype.onFinish = function(){
  console.log("Scene Finished");
};

// NOTE(Inspix): Override Init function of the base class
// use to load all needed assets for the current Scene.
SplashScreenScene.prototype.Init = function(){
  var gl = this.gl;
  var self = this;
  var image = new Image();
    image.onload = function(){
    self.texture = new Texture(gl,image);

    self.sprite = new Sprite(gl,new Vec3(30,30,0),new Vec2(200,200),self.texture);
    self.sprite.origin.x = 100;
    self.sprite.origin.y = 100;
    self.initialized = true;
  };
  image.src = 'textures/lava.png';
};
