// TODO(Inspix): Should make the instance less buffer heavy.
// NOTE(Inspix): Maybe static 1 unit buffers, with a lot of scaling for size
//               while all transformations are made with the matricies.
function Sprite(gl, vec3Pos, vec2size, texture, texCoords, colors) {
  // NOTE(Inspix): Useful and needed members
  this.glContext = gl;
  this.texture = texture;

  // NOTE(Inspix): Convinience variable reference to save writing;
  var shader = this.glContext.defaultShader;

  // NOTE(Inspix): Sprite transformation variables.
  this.width = vec2size.x || 1;
  this.height = vec2size.y || 1;
  this.transform = new Mat4(1);
  this.position = vec3Pos || new Vec3(0, 0, 0);
  this.rotation = 0;
  this.scale = new Vec3(1, 1, 1);
  // TODO: Put offset to rotate around a specified origin.
  // TODO: Create getters/setters where needed.

  var vertecies = new Float32Array(
    [
      0, 0, 0,
      0 + (this.width || 1), 0, 0,
      0 + (this.width || 1), 0 + (this.height || 1), 0,
      0, 0 + (this.height || 1), 0
    ]
  );

  var indicies = new Uint16Array(
    [
      0, 1, 2,
      2, 3, 0
    ]
  );

  this.ibo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicies, gl.STATIC_DRAW);

  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertecies, gl.STATIC_DRAW);

  this.colorBuffer = gl.createBuffer();
  var colorBufferData = colors || new Uint32Array(
    [
      0xffffffff,
      0xffffffff,
      0xffffffff,
      0xffffffff
    ]
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colorBufferData, gl.STATIC_DRAW);

  this.tcoordsBuffer = gl.createBuffer();
  var tcoordsBufferData = texCoords || new Float32Array([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0]);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.tcoordsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, tcoordsBufferData, gl.STATIC_DRAW);


  this.updateTransform = function() {
    // TODO(Inspix): Optimisation here, unless batch rendering is implemented.
    var translation = new Mat4().setTranslation(this.position);
    var rotation = new Mat4().setRotation(this.rotation, 0, 0, 1);
    var scale = new Mat4().setScale(this.scale);

    // NOTE(Inspix): Expensive call - next line makes 192 multiplications.
    this.transform = translation.multiply(rotation).multiply(scale);
  };

  this.draw = function() {
    var gl = this.glContext;

    shader.setUniformMat4(this.transform, shader.uLocations.uModelMatrix);
    shader.setUniformi(this.texture ? true : false, shader.uLocations.useTexturing);

    var texCoordLoc = shader.aLocations.aTexCoord;
    var positionLoc = shader.aLocations.aPosition;
    var colorLoc = shader.aLocations.aColor;

    if(this.texture){
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture.id);
      gl.uniform1i(shader.aLocations.uSampler, 0);
      gl.enableVertexAttribArray(texCoordLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.tcoordsBuffer);
      gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    }
    gl.enableVertexAttribArray(positionLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(colorLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.vertexAttribPointer(colorLoc, 4, gl.UNSIGNED_BYTE, true, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    shader.setUniformMat4(Identity, shader.uLocations.uModelMatrix);


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    if(this.texture){
      shader.setUniformi(false, shader.uLocations.useTexturing);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.disableVertexAttribArray(texCoordLoc);
    }
    gl.disableVertexAttribArray(positionLoc);
    gl.disableVertexAttribArray(colorLoc);
  };

  this.updateTransform();
}
