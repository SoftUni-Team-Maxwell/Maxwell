// NOTE(Inspix): Slow Implementation until i figure out a better way to Render, with less draw calls.
function SpriteBatch(gl) {
  this.glContext = gl;
  var shader = gl.defaultShader;
  var vertexComponents = 11;
  var vertexSize = vertexComponents * Float32Array.BYTES_PER_ELEMENT;

  var bufferData = new ArrayBuffer(vertexSize * 4);
  var vertexData = new Float32Array(bufferData);
  var vertexColors = new Uint32Array(bufferData);

  this.VertexDataBuffer = gl.createBuffer();
  this.IndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexDataBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.DYNAMIC_DRAW);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 2, 3, 0]), gl.DYNAMIC_DRAW);


  this.begin = function() {
    gl.enableVertexAttribArray(shader.aLocations.aPosition);
    gl.enableVertexAttribArray(shader.aLocations.aTexCoord);
    gl.enableVertexAttribArray(shader.aLocations.aRotation);
    gl.enableVertexAttribArray(shader.aLocations.aColor);
    gl.enableVertexAttribArray(shader.aLocations.aTPosition);
    gl.enableVertexAttribArray(shader.aLocations.aTOrigin);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexDataBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexDataBuffer);
    gl.vertexAttribPointer(shader.aLocations.aPosition, 3, gl.FLOAT, false, vertexSize, 0);
    gl.vertexAttribPointer(shader.aLocations.aTexCoord, 2, gl.FLOAT, false, vertexSize, 4 * 3);
    gl.vertexAttribPointer(shader.aLocations.aRotation, 1, gl.FLOAT, false, vertexSize, 4 * 5);
    gl.vertexAttribPointer(shader.aLocations.aColor, 4, gl.UNSIGNED_BYTE, true, vertexSize, 4 * 6);
    gl.vertexAttribPointer(shader.aLocations.aTPosition, 2, gl.FLOAT, false, vertexSize, 4 * 7);
    gl.vertexAttribPointer(shader.aLocations.aTOrigin, 2, gl.FLOAT, false, vertexSize, 4 * 9);
  };


  this.drawSprite = function(sprite) {
    this.draw(sprite,sprite.position.x, sprite.position.y, sprite.width, sprite.height, sprite.rotation, 0xffffffff, sprite.position.z,sprite.origin.x,sprite.origin.y,sprite.flipX);
  };

  this.draw = function(sprite, x, y, width, height, rotation, color, depth, originX, originY,flipX) {
    this.drawTexture(sprite.texture,null,new Rect(x,y,width,height),rotation,color,depth,originX,originY,flipX);
  };

  this.drawTexture = function(texture, sourceRect, destinationRect, rotation, color, depth, originX, originY,flipX) {
    var index = 0;
    if (!sourceRect) {
      sourceRect = new Rect(0,0,1,1);
    }
    if (!originX) {
      originX = 0;
    }
    if (!originY) {
      originY = 0;
    }
    var uVx0;
    var uVy0;
    var uVx1;
    var uVy1;
    var uVx2;
    var uVy2;
    var uVx3;
    var uVy3;

    if (flipX) {
      uVx0 = sourceRect.x + sourceRect.width;
      uVy0 = sourceRect.y;
      uVx1 = sourceRect.x;
      uVy1 = sourceRect.y;
      uVx2 = sourceRect.x;
      uVy2 = sourceRect.y + sourceRect.height;
      uVx3 = sourceRect.x + sourceRect.width;
      uVy3 = sourceRect.y + sourceRect.height;
    }else {
      uVx0 = sourceRect.x;
      uVy0 = sourceRect.y;
      uVx1 = sourceRect.x + sourceRect.width;
      uVy1 = sourceRect.y;
      uVx2 = sourceRect.x + sourceRect.width;
      uVy2 = sourceRect.y + sourceRect.height;
      uVx3 = sourceRect.x;
      uVy3 = sourceRect.y + sourceRect.height;
    }
    vertexData[index++] = 0;
    vertexData[index++] = 0;
    vertexData[index++] = depth;
    vertexData[index++] = uVx0;
    vertexData[index++] = uVy0;
    vertexData[index++] = rotation;
    vertexColors[index++] = color;
    vertexData[index++] = destinationRect.x;
    vertexData[index++] = destinationRect.y;
    vertexData[index++] = originX;
    vertexData[index++] = originY;

    vertexData[index++] = destinationRect.width;
    vertexData[index++] = 0;
    vertexData[index++] = depth;
    vertexData[index++] = uVx1;
    vertexData[index++] = uVy1;
    vertexData[index++] = rotation;
    vertexColors[index++] = color;
    vertexData[index++] = destinationRect.x;
    vertexData[index++] = destinationRect.y;
    vertexData[index++] = originX;
    vertexData[index++] = originY;

    vertexData[index++] = destinationRect.width;
    vertexData[index++] = destinationRect.height;
    vertexData[index++] = depth;
    vertexData[index++] = uVx2;
    vertexData[index++] = uVy2;
    vertexData[index++] = rotation;
    vertexColors[index++] = color;
    vertexData[index++] = destinationRect.x;
    vertexData[index++] = destinationRect.y;
    vertexData[index++] = originX;
    vertexData[index++] = originY;

    vertexData[index++] = 0;
    vertexData[index++] = destinationRect.height;
    vertexData[index++] = depth;
    vertexData[index++] = uVx3;
    vertexData[index++] = uVy3;
    vertexData[index++] = rotation;
    vertexColors[index++] = color;
    vertexData[index++] = destinationRect.x;
    vertexData[index++] = destinationRect.y;
    vertexData[index++] = originX;
    vertexData[index++] = originY;

    this._render(texture);
  };

  this._render = function(texture) {
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, bufferData);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture.id);
    shader.setUniformi(texture ? true : false, shader.uLocations.useTexturing);
    shader.setUniformi(0, shader.uLocations.uSampler);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IndexBuffer);

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

  };

  this.end = function() {
    shader.setUniformi(false, shader.uLocations.useTexturing);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.disableVertexAttribArray(shader.aLocations.aPosition);
    gl.disableVertexAttribArray(shader.aLocations.aTexCoord);
    gl.disableVertexAttribArray(shader.aLocations.aRotation);
    gl.disableVertexAttribArray(shader.aLocations.aColor);
  };
}
