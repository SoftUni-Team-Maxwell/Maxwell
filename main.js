var gl;
var canvas;

var batch;
var particleEngine;
var tootParticles;
var sceneManager;
var gameplayScene;
document.addEventListener("DOMContentLoaded",init);

window.onerror = function(msg,url,line){
  // TODO(Inspix): Fix this, it's so bad.
  alert(url + '(' + line + '):' + msg);
};




function init(){
  canvas = document.getElementById('webgl-canvas');
  gl = initWebGL(canvas);
  gl.defaultShader.setUniformMat4(new Mat4().createOrtho(0,canvas.width,canvas.height,0,-100,1000), gl.defaultShader.uLocations.uPrMatrix);
  batch = new SpriteBatch(gl);
  gameplayScene = new GamePlayScene(gl,canvas);
  gameplayScene.Init();
  sceneManager = new SceneManager(gl);

  var Scene = new SplashScreenScene(gl);
  Scene.Init();

  window.addEventListener('keydown',function(e){
    switch (e.key) {
      case "j":
      sceneManager.ChangeScene(gameplayScene);
        break;
      case "k":
        sceneManager.ChangeScene(Scene);
        break;
      default:

    }
  });

  drawScene();

}



function drawScene(){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  batch.begin();
  sceneManager.Draw(batch);
  batch.end();

  sceneManager.Update(1);


  requestAnimationFrame(drawScene);
}
