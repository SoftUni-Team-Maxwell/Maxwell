function SceneManager(glContext) {
  this.gl = glContext;
  this._scenes = {};
  this._transitions = {};
  this._currentScene = new SplashScreenScene(this.gl);
  this._currentScene.Init();
  this._currentTransition = null;
  this._nextScene = null;
  this._isTransitioning = false;

}
SceneManager.prototype = {
  get currentScene() { return this._currentScene;},
  set currentScene(value) {
    if (value instanceof SceneNode)
      this._currentScene = value;
  },
  get currentTransition() { return this._currentTransition;},
  set currentTransition(value) {
    if (value instanceof Transition)
      this._currentTransition = value;
  }
};

SceneManager.prototype.Update = function(delta){
  if (this._isTransitioning) {
    this._currentTransition.Update(delta);
  }
  this._currentScene.Update(delta);
};

SceneManager.prototype.Draw = function(batch){
  if (this._currentScene instanceof SceneNode) {
    this._currentScene.Draw(batch);
  }
};

SceneManager.prototype.ChangeScene = function(scene){
  if (scene instanceof SceneNode) {
    if (this._currentTransition) {
      this._nextScene = scene;
      this._isTransitioning = true;
    }
    else{
      this._currentScene = scene;
    }
  }
};
