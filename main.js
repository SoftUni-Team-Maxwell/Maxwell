var gl;
var canvas;
var background,background2,ground,ground2,playerSheet;
var batch;

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
  var backgroundImg = new Image();
  backgroundImg.src = "textures/bg.png";
  var groundImg = new Image();
  groundImg.src='textures/grass.png';
  var lavaImg = new Image();
  lavaImg.src = 'textures/lava.png';
  var playerImg = new Image();
  playerImg.src = 'textures/playerSprite.png';
  // NOTE(Inspix): The sprites should be made after the image is loaded,
  //               Thats why i use the onload callback to be sure.
  backgroundImg.onload = function(){
    var backgroundTexture = new Texture(gl,backgroundImg);
    var groundTexture = new Texture(gl,groundImg);
    var lavaTexture = new Texture(gl,lavaImg);
    playerSheet = new Texture(gl,playerImg);
    background = new Sprite(gl,new Vec3(0,0,0),new Vec2(canvas.width,canvas.height),backgroundTexture);
    background2 = new Sprite(gl,new Vec3(canvas.width,0,0),new Vec2(canvas.width,canvas.height),backgroundTexture);
    lava = new Sprite(gl,new Vec3(0,0,0),new Vec2(canvas.width,100),lavaTexture);
    ground = new Sprite(gl,new Vec3(0,0,0),new Vec2(canvas.width,100),groundTexture);
    ground2 = new Sprite(gl,new Vec3(canvas.width,0,0),new Vec2(canvas.width,100),groundTexture);
    drawScene();
  };

}

var row = 0.0;
var col = 0.0;
var cooldown = 5;
// NOTE(Inspix): Pseudo gameloop, just for testing, everything in this file is temporary.
function drawScene(){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  background.position.x -= 2;
  background2.position.x -= 2;

  if (background2.position.x <= 0) {
    background.position.x += canvas.width;
    background2.position.x += canvas.width;
  }

  ground.position.x-=5;
  ground2.position.x-=5;

  batch.begin();
  batch.drawSprite(background);
  batch.drawSprite(background2);
  batch.drawSprite(ground);
  batch.drawSprite(ground2);
  batch.drawTexture(playerSheet,new Rect(row,col,0.25,0.25),new Rect(100,100,200,200),0,0xffffffff,1);
  batch.end();
  // NOTE(Inspix): Inplace animation, just for testing, should be easily moved in its own object.
  // NOTE(Inspix): Rotation and image flip is not yet implemented.
  if (--cooldown < 0) {
    cooldown = 5;
    row += 0.25;
    if (row >= 1.0) {
      row = 0;
      col += 0.25;
      if (col >= 1) {
        col = 0;
      }
    }
  }

  if (ground2.position.x<=0) {
      ground.position.x += canvas.width;
      ground2.position.x += canvas.width;
  }

  requestAnimationFrame(drawScene);
}
