var defaultVS = [
  'attribute vec3 aPosition;',
  'attribute vec4 aColor;',
  'attribute vec2 aTexCoord;',
  'attribute float aRotation;',
  'attribute float tid;',
  'varying vec4 vColor;',
  'varying vec2 vTexCoord;',
  'varying float vTid;',
  'uniform mat4 uPrMatrix;',
  'uniform mat4 uVwMatrix;',
  'uniform mat4 uModelMatrix;',
  'void main(){',
  'vColor = aColor;',
  'vTid = tid;',
  'vTexCoord = aTexCoord;',
  'float rot = aRotation;',
  'gl_Position = uPrMatrix * uVwMatrix * uModelMatrix * vec4(aPosition,1.0);',
  '}',
].join('\n');

var defaultFS = [
  'precision mediump float;',
  'varying vec4 vColor;',
  'varying vec2 vTexCoord;',
  'varying float vTid;',
  'uniform bool useTexturing;',
  'uniform sampler2D uSampler[16];',
  'void main(){',
  'vec4 c = vec4(1.0,1.0,1.0,1.0);',
  'if(useTexturing){',
  ' int id = int(vTid + 0.5);',
  ' c = texture2D(uSampler[id],vTexCoord);',
  '}',
  'gl_FragColor = vColor * c;',
  '}'
].join('\n');

// NOTE(Inspix): Currently is used mainly for the standard shader.
// TODO(Inspix): Make it a bit more modular.
function ShaderProgram(gl, vsSource, fsSource) {
  this.glContext = gl;
  var makeDefault = false;
  if (!vsSource) {

    vsSource =  document.getElementById('vshader').textContent;  //String(defaultVS);
    console.log('No Vertex Shader source supplied, creating default program');
    makeDefault = true;
  }
  if (!fsSource) {
    fsSource = document.getElementById('fshader').textContent; //String(defaultFS);
    console.log('No Fragment Shader source supplied, creating default program');
    makeDefault = true;
  }
  this.vsSource = vsSource;
  this.fsSource = fsSource;
  var inUse = false;

  // TODO(Inspix): Add more uniform setters
  this.setUniformMat4 = function(mat4, loc) {
    if (mat4 instanceof Mat4) {
      if (!inUse) {
        this.useProgram();
      }
      this.glContext.uniformMatrix4fv(loc, false, mat4.values);
    }
  };

  this.setUniformi = function(value, loc) {
      if (!inUse) {
        this.useProgram();
      }
      this.glContext.uniform1i(loc, value);
  };

  this.setUniform2f = function(value, loc) {
      if (value instanceof Vec2) {
        if (!inUse) {
          this.useProgram();
        }
        this.glContext.uniform2f(loc, value.x,value.y);
      }

  };

  this.isInUse = function() {
    return inUse;
  };

  this.useProgram = function() {
    if (!inUse) {
      inUse = true;
      this.glContext.useProgram(this.id);
    }
  };
  this.unuseProgram = function() {
    if (inUse) {
      inUse = false;
      this.glContext.useProgram(0);
    }
  };

  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vsSource);
  gl.compileShader(vertexShader);

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    throw 'VertexShader compilation error ' + gl.getShaderInfoLog(vertexShader);
  }
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fsSource);
  gl.compileShader(fragmentShader);

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    throw 'FragmentShader compilation error ' + gl.getShaderInfoLog(fragmentShader);
  }


  this.id = gl.createProgram();
  gl.attachShader(this.id, vertexShader);
  gl.attachShader(this.id, fragmentShader);
  gl.linkProgram(this.id);

  if (!gl.getProgramParameter(this.id, gl.LINK_STATUS)) {
    throw gl.getProgramInfoLog(this.id);
  }

  this.aLocations = {};
  this.uLocations = {};
  if (makeDefault) {
    this.aLocations.aPosition = gl.getAttribLocation(this.id, 'aPosition');
    this.aLocations.aTexCoord = gl.getAttribLocation(this.id, 'aTexCoord');
    this.aLocations.aColor = gl.getAttribLocation(this.id, 'aColor');
    this.aLocations.aRotation = gl.getAttribLocation(this.id, 'aRotation');
    this.aLocations.aTPosition = gl.getAttribLocation(this.id, 'aTPosition');
    this.aLocations.aTOrigin = gl.getAttribLocation(this.id, 'aTOrigin');
    this.aLocations.aTid = gl.getAttribLocation(this.id, 'aTid');
    this.uLocations.uPrMatrix = gl.getUniformLocation(this.id, 'uPrMatrix');
    this.uLocations.uVwMatrix = gl.getUniformLocation(this.id, 'uVwMatrix');
    this.uLocations.uModelMatrix = gl.getUniformLocation(this.id, 'uModelMatrix');
    this.uLocations.useTexturing = gl.getUniformLocation(this.id, 'useTexturing');
    this.uLocations.uSampler = gl.getUniformLocation(this.id, 'uSampler');


    var identity = new Mat4(1);
    this.setUniformMat4(identity, this.uLocations.uPrMatrix);
    this.setUniformMat4(identity, this.uLocations.uVwMatrix);
    this.setUniformMat4(identity, this.uLocations.uModelMatrix);

  }

}
