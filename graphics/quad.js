var defaultColors = new Uint32Array(
  [
     0xffff0000,
     0xff00ff00,
     0xff0000ff,
     0xffffffff
  ]
);

// NOTE(Inspix): Can be used for static untextured objects. Otherwise Sprite is superior.
function Quad(gl, positionVec, width, heigth, colorArray){
  this.glContext = gl;
  this.shader = gl.defaultShader;
  if (!(positionVec instanceof Vec3)) {
    throw 'Position must be specified as a Vec3 Object';
  }
  var x = positionVec.x;
  var y = positionVec.y;
  var z = positionVec.z;
  var vertecies = new Float32Array(
    [
       x,y,z,
       x + width,y, z,
       x + width, y + heigth, z,
       x, y + heigth, z,
    ]
  );

  var indicies = new Uint16Array(
    [
      0, 1, 2,
      2, 3, 0
    ]
  );

  var colors = colorArray || defaultColors;

  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertecies, gl.STATIC_DRAW);

  this.ibo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicies, gl.STATIC_DRAW);

  this.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,this.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

  this.glContext.bindBuffer(gl.ARRAY_BUFFER,null);

  this.draw = function(){
    this.glContext.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.ibo);
    this.glContext.enableVertexAttribArray(this.shader.aLocations.aPosition);
    this.glContext.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer);
    this.glContext.vertexAttribPointer(this.shader.aLocations.aPosition, 3, gl.FLOAT, false, 0, 0);

    this.glContext.enableVertexAttribArray(this.shader.aLocations.aColor);
    this.glContext.bindBuffer(gl.ARRAY_BUFFER,this.colorBuffer);
    this.glContext.vertexAttribPointer(this.shader.aLocations.aColor, 4, gl.UNSIGNED_BYTE, true, 0, 0);

    this.glContext.drawElements(gl.TRIANGLES, 6, this.glContext.UNSIGNED_SHORT,0);

    this.glContext.bindBuffer(gl.ARRAY_BUFFER,null);
    this.glContext.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
  };
}
