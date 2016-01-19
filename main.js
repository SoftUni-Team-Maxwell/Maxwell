var gl;
var quad;
var canvas;
var sprite,sprite2;

document.addEventListener("DOMContentLoaded",init);

window.onerror = function(msg,url,line){
  // TODO(Inspix): Fix this, it's so bad.
  alert(url + '(' + line + '):' + msg);
};


function init(){
  canvas = document.getElementById('webgl-canvas');
  gl = initWebGL(canvas);
  gl.defaultShader.setUniformMat4(new Mat4().createOrtho(0,canvas.width,canvas.height,0,-100,1000), gl.defaultShader.uLocations.uPrMatrix);
  var colors = new Uint32Array(
    [
      // NOTE(Inspix): Using 32 bit integer instead of 4 32 bit floats for colors
      //               too bad its flipped from RGBA to ABGR;
      //AABBGGRR
      0xff0000ff,
      0xff00ffff,
      0xffff0000,
      0xffffff00
    ]
  );

  var colorsQuad = new Uint32Array(
    [
      0xffff00ff,
      0xff00ffff,
      0xffff0000,
      0xff00ff00
    ]
  );

  quad = new Quad(gl,new Vec3(700,400,1), 100,100,colorsQuad);
  var image = new Image();
  image.src = "textures/bg.png";

  // NOTE(Inspix): The sprites should be made after the image is loaded,
  //               Thats why i use the onload callback to be sure.
  image.onload = function(){
    var texture = new Texture(gl,image);
    sprite = new Sprite(gl,new Vec3(0,0,0),new Vec2(canvas.width,canvas.height),texture);
    sprite2 = new Sprite(gl,new Vec3(canvas.width,0,0),new Vec2(canvas.width,canvas.height),texture);
    // NOTE(Inspix): Non textured Sprite, same as the quad, but can be transformed.
    sprite3 = new Sprite(gl,new Vec3(200,200,1),new Vec2(100,100),null,null,colors);
    drawScene();
  };

}
var accumulator = 0;

// NOTE(Inspix): Pseudo gameloop, just for testing, everything in this file is temporary.
function drawScene(){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  quad.draw();
  sprite.position.x -= 1;
  sprite2.position.x -= 1;
  sprite3.rotation = accumulator;
  if (sprite2.position.x <= 0) {
    sprite.position.x += canvas.width;
    sprite2.position.x += canvas.width;
  }
  sprite.updateTransform();
  sprite2.updateTransform();
  sprite3.updateTransform();
  sprite.draw();
  sprite2.draw();
  sprite3.draw();

  accumulator += 0.1;
  requestAnimationFrame(drawScene);
}
