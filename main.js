var GL;
var CANVAS;
var batch;
var sceneManager;
var gameplayScene;
var nextSceene = null;
var ASSETMANAGER;
document.addEventListener("DOMContentLoaded",init);

window.onerror = function(msg,url,line){
  // TODO(Inspix): Fix this, it's so bad.
  alert(url + '(' + line + '):' + msg);
};

function init(){
  CANVAS = document.getElementById('webgl-canvas');
  GL = initWebGL(CANVAS);
  var matrix = new Mat4().createOrtho(0,CANVAS.width,CANVAS.height,0,-100,1000);
  GL.defaultShader.setUniformMat4(matrix, GL.defaultShader.uLocations.uPrMatrix);
  GL.defaultFontShader.setUniformMat4(matrix, GL.defaultFontShader.uLocations.uPrMatrix);
  batch = new SpriteBatch(GL);
  ASSETMANAGER = new AssetManager();
  gameplayScene = new GamePlayScene(GL,CANVAS);
  gameplayScene.Init();
  sceneManager = new SceneManager(GL);

  var Scene = new SplashScreenScene(GL);
  Scene.Init();

  window.addEventListener('keydown',function(e){
    console.log(e);
    switch (e.keyCode) {
        case 13:
            switch (nextSceene) {
                case 'New Game': sceneManager.ChangeScene(gameplayScene); break;
                case 'About Us': break;
                case 'Exit': break;
            }
            break;
        case 40:
            if (selectedOptionMenu<2) {
                selectedOptionMenu++;
                nextSceene = menuOptions[selectedOptionMenu];
            }
            break;
        case 38:
            if (selectedOptionMenu>0) {
                selectedOptionMenu--;
                nextSceene = menuOptions[selectedOptionMenu];
            }
            break;
    }
  });

/* ---------------------- AssetManager Tests ---------------------- */
  ASSETMANAGER.QueueToLoadFont('default','fonts/Calibri.fnt');
  ASSETMANAGER.QueueToLoadFont('cooperB','fonts/CooperBlack.fnt');
  ASSETMANAGER.QueueToLoadFont('cooperBI','fonts/CooperBlackItalic.fnt');
  ASSETMANAGER.QueueToLoadTexture('background','textures/bg.png');
  ASSETMANAGER.QueueToLoadTexture('logo','textures/logo.png');
  ASSETMANAGER.QueueToLoadSprite('background','background',
  {
      position : new Vec3(0, 0, 0),
      size : new Vec2(CANVAS.width, CANVAS.height)
    }
  );
  ASSETMANAGER.QueueToLoadSprite('logo','logo',
  {
      position : new Vec3(CANVAS.width / 3.2 - 10, CANVAS.height / 1.5, 0),
      size : new Vec2(400, 170)
    }
  );
  ASSETMANAGER.onProgressUpdate = function(percent, msg){
    console.log(percent + '% - ' + msg);
  };
  ASSETMANAGER.Load();

/* ---------------------- AssetManager Tests End ------------------- */

  drawScene();

}

function drawScene(){
  GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

  batch.begin();
  sceneManager.Draw(batch);
  /*StringDraw();*/
  batch.End();

  sceneManager.Update(1);


  requestAnimationFrame(drawScene);
}
