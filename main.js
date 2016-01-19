var gl;
var quad;
var canvas;
var background,background2,ground,ground2;

document.addEventListener("DOMContentLoaded",init);

window.onerror = function(msg,url,line){
  // TODO(Inspix): Fix this, it's so bad.
  alert(url + '(' + line + '):' + msg);
};


function init(){
  canvas = document.getElementById('webgl-canvas');
  gl = initWebGL(canvas);
  gl.defaultShader.setUniformMat4(new Mat4().createOrtho(0,canvas.width,canvas.height,0,-100,1000), gl.defaultShader.uLocations.uPrMatrix);

  var backgroundImg = new Image();
  backgroundImg.src = "textures/bg.png";
  var groundImg = new Image();
  groundImg.src='textures/grass.png';
  var lavaImg = new Image();
  lavaImg.src = 'textures/lava.png';

  // NOTE(Inspix): The sprites should be made after the image is loaded,
  //               Thats why i use the onload callback to be sure.
  backgroundImg.onload = function(){
    var backgroundTexture = new Texture(gl,backgroundImg);
    var groundTexture = new Texture(gl,groundImg);
    var lavaTexture = new Texture(gl,lavaImg);
    background = new Sprite(gl,new Vec3(0,0,0),new Vec2(canvas.width,canvas.height),backgroundTexture);
    background2 = new Sprite(gl,new Vec3(canvas.width,0,0),new Vec2(canvas.width,canvas.height),backgroundTexture);
    lava = new Sprite(gl,new Vec3(0,0,0),new Vec2(canvas.width,100),lavaTexture);
    ground = new Sprite(gl,new Vec3(0,0,0),new Vec2(canvas.width,100),groundTexture);
    ground2 = new Sprite(gl,new Vec3(canvas.width,0,0),new Vec2(canvas.width,100),groundTexture);

    drawScene();
  };

}
var accumulator = 0;

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


  background.updateTransform();
  background2.updateTransform();
  ground.updateTransform();
  ground2.updateTransform();
  background.draw();
  background2.draw();
  ground.draw();
  ground2.draw();
  if (ground2.position.x<=0) {
      ground.position.x += canvas.width;
      ground2.position.x += canvas.width;
  }


  accumulator += 0.1;
  requestAnimationFrame(drawScene);
}
