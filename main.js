var GL;
var CANVAS;
var batch;
var loadingFont;
var ASSETMANAGER;
var FULLSCREEN = false;
var INITIALSIZE;
document.addEventListener("DOMContentLoaded", init);

window.onerror = function(msg, url, line) {
  // TODO(Inspix): Fix this, it's so bad.
  alert(url + '(' + line + '):' + msg);
};

function init() {
  CANVAS = document.getElementById('webgl-canvas');
  INITIALSIZE = CANVAS.getBoundingClientRect();
  GL = initWebGL(CANVAS);
  var matrix = new Mat4().createOrtho(0, CANVAS.width, CANVAS.height, 0, -100, 1000);
  GL.defaultShader.setUniformMat4(matrix, GL.defaultShader.uLocations.uPrMatrix);
  GL.defaultFontShader.setUniformMat4(matrix, GL.defaultFontShader.uLocations.uPrMatrix);
  batch = new SpriteBatch(GL);


  /* ---------------------- Load assets ---------------------- */
  ASSETMANAGER = new AssetManager();
  ASSETMANAGER.QueueToLoadFont('default', 'fonts/Calibri.fnt');
  ASSETMANAGER.QueueToLoadFont('cooperB', 'fonts/CooperBlack.fnt');
  ASSETMANAGER.QueueToLoadFont('cooperBI', 'fonts/CooperBlackItalic.fnt');
  ASSETMANAGER.QueueToLoadTexture('background', 'textures/bg.png');
  ASSETMANAGER.QueueToLoadTexture('logo', 'textures/logo.png');
  ASSETMANAGER.QueueToLoadTexture('pauseButton', 'textures/pauseButton.png');
  ASSETMANAGER.QueueToLoadTexture('bubble', 'textures/bubble.png');
  ASSETMANAGER.QueueToLoadTexture('grass', 'textures/grass.png');
  ASSETMANAGER.QueueToLoadTexture('lava', 'textures/lava.png');
  ASSETMANAGER.QueueToLoadTexture('player', 'textures/playerSprite.png');

  ASSETMANAGER.onProgressUpdate = function(percent, msg) {
    console.log(percent + '% - ' + msg);
    cent = percent / 100;
    loading(msg);
  };
  ASSETMANAGER.onLoad = function() {
    // glContext, positionVec, width, heigth, colorArray
    var gameplayScene = new GamePlayScene(GL, CANVAS);
    gameplayScene.Init();
    var Scene = new SplashScreenScene(GL);
    Scene.Init();
    sceneManager = new SceneManager(GL);
    Scene.sceneManager = sceneManager;
    gameplayScene.sceneManager = sceneManager;

    sceneManager.AddScene('Splash',Scene);
    sceneManager.AddScene('GamePlay',gameplayScene);

    sceneManager.ChangeScene('Splash');
    setTimeout(drawScene, 1000);
  };

  loadingFont = new SpriteFont(GL, 'fonts/Calibri.fnt');
  loadingFont.onLoad = function() {
    ASSETMANAGER.AddFont('default',this);
    ASSETMANAGER.Load();
    console.log("font loaded");
  };
  loadingFont.Init();

  /* ---------------------- Load Assets End ------------------- */

}

function fullscreen() {
  var element = document.getElementById('wrapper');
  if (element.requestFullscreen) {
    element.requestFullscreen();
    FULLSCREEN = !FULLSCREEN;
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
    FULLSCREEN = !FULLSCREEN;
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
    FULLSCREEN = !FULLSCREEN;
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
    FULLSCREEN = !FULLSCREEN;
  }
}

var lineLength = 500;
var cent = 0;
var width = 100;

function loading(msg) {
  GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
  batch.begin();
  batch.drawRect(new Rect(50, 50, 50 + lineLength, 50), {
    color: 0xff0000ff,
    thickness: 4
  });
  batch.drawQuad(new Rect(50, 50, 50 + (lineLength * cent), 50), {
    color: 0xff888888
  });
  batch.drawString(loadingFont, msg, 100, 100, {
    scaleX: 0.5,
    scaleY: 0.5
  });
  batch.End();
}

function drawScene() {
  GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

  batch.begin();
  sceneManager.Draw(batch);

  batch.End();
  sceneManager.Update(1);

  requestAnimationFrame(drawScene);
}
