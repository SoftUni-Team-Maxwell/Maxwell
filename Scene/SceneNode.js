function SceneNode(glContext){
  this.gl = glContext;

  this.children = [];
  this.initialized = false;
  this.sceneManager = null;

}

SceneNode.prototype.Init = function(){
  throw 'SceneNode Init not implemented';
};

SceneNode.prototype.onFinish = function(){
  throw 'SceneNode onFinish not implemented';
};

SceneNode.prototype.Update = function(delta){
  var d = delta || 1;
  this.UpdateSelf(delta);
  for (var node in this.children) {
    if (node.hasOwnProperty('Update')) {
      node.Update(d);
    }
  }
};

SceneNode.prototype.UpdateSelf = function(delta){
  throw 'Update self not implemented';
};

SceneNode.prototype.Draw = function(batch){
  if (batch instanceof SpriteBatch) {
    this.DrawSelf(batch);
    for (var node in this.children) {
      if (node.hasOwnProperty('Draw')) {
        node.Draw(batch);
      }
    }
  }
};

SceneNode.prototype.DrawSelf = function(batch){
  throw 'DrawSelf not implemented';
};

SceneNode.prototype.AddNode = function(node){
  if (node instanceof SceneNode) {
    this.children.push(node);
  }
};

SceneNode.prototype.RemoveNode = function(node){
  if (node instanceof SceneNode) {
    for (var i = 0; i < this.children.length; i++) {
      if (node === this.children[i]) {
        this.children.splice(i,1);
        return;
      }
    }
  }
};
