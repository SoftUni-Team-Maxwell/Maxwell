var gl;
var canvas;
var batch;
var sceneManager;
var gameplayScene;
var font;
document.addEventListener("DOMContentLoaded",init);

window.onerror = function(msg,url,line){
  // TODO(Inspix): Fix this, it's so bad.
  alert(url + '(' + line + '):' + msg);
};


function init(){
  canvas = document.getElementById('webgl-canvas');
  gl = initWebGL(canvas);
  var matrix = new Mat4().createOrtho(0,canvas.width,canvas.height,0,-100,1000);
  gl.defaultShader.setUniformMat4(matrix, gl.defaultShader.uLocations.uPrMatrix);
  gl.defaultFontShader.setUniformMat4(matrix, gl.defaultFontShader.uLocations.uPrMatrix);
  batch = new SpriteBatch(gl);
  gameplayScene = new GamePlayScene(gl,canvas);
  gameplayScene.Init();
  sceneManager = new SceneManager(gl);

  var Scene = new SplashScreenScene(gl);
  Scene.Init();

  window.addEventListener('keydown',function(e){
    console.log(e);
    switch (e.keyCode) {
      case 74:
      sceneManager.ChangeScene(gameplayScene);
        break;
      case 75:
        sceneManager.ChangeScene(Scene);
        break;
      default:

    }
  });

  font = new SpriteFont(gl,'fonts/Calibri.fnt');

  drawScene();

}

function drawScene(){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  batch.begin();
  sceneManager.Draw(batch);
  StringDraw();
  batch.End();

  sceneManager.Update(1);


  requestAnimationFrame(drawScene);
}

/* ---------------- Font Rendering Tests ---------------- */

var stringOptions = {
  scaleX: 0.75,
  scaleY: 1.25,
  rotation: 0,
  color: 0xff0000ff,
  outlineColor: 0xffffff,
  smoothing: 0.1,
  depth:100
};
var stringSize;

function StringDraw(){
  if (font.initialized) {
    if (!stringSize) {
      stringSize = font.MeasureString('Team Maxwell JavaScript TeamWork');
      stringSize.x *= 0.75;
    }
    batch.drawString(font,'Team Maxwell JavaScript TeamWork',canvas.width/2 - (stringSize.x || 1)/2,768, stringOptions);
  }
}
