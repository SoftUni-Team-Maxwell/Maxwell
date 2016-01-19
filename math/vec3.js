function Vec3(a,b,c){
  if (isNaN(a) || isNaN(b) || isNaN(c)) {
    throw 'Cannot construct Vec3 from non number variables';
  }

  this._x = a;
  this._y = b;
  this._z = c;

  // NOTE(Inspix): Add more operations that could be useful.

  this.add = function(other){
    if (other instanceof Vec3) {
      this._x += other.x;
      this._y += other.y;
      this._z += other.z;
    }
  };

  this.substract = function(other){
    if(other instanceof Vec3){
      this._x -= other.x;
      this._y -= other.y;
      this._z -= other.z;
    }
  };

  this.multiply = function(other){
    if(other instanceof Vec3){
      this._x *= other.x;
      this._y *= other.y;
      this._z *= other.z;
    }
  };

  this.divide = function(other){
    if (other instanceof Vec3) {
      this._x /= other.x;
      this._y /= other.y;
      this._z /= other.z;
    }
  };

  this.addCopy = function(other){
    if (other instanceof Vec3) {
      var result = new Vec3(this._x + other.x, this._y + other.y, this._z + other.z);
      return result;
    }
  };

  this.substractCopy = function(other){
    if (other instanceof Vec3) {
      var result = new Vec3(this._x - other.x, this._y - other.y, this._z - other.z);
      return result;
    }
  };

  this.multiplyCopy = function(other){
    if (other instanceof Vec3) {
      var result = new Vec3(this._x * other.x, this._y * other.y, this._z * other.z);
      return result;
    }
  };

  this.divideCopy = function(other){
    if (other instanceof Vec3) {
      var result = new Vec3(this._x / other.x, this._y / other.y, this._z / other.z);
      return result;
    }
  };

  this.toArray = function(){
    return new Float32Array([x,y,z]);
  };

  this.toString = function(){
    return 'Vec3[' + this._x + ', ' + this._y + ', ' + this._z + ']';
  };
}

Vec3.prototype = {
  get x() { return this._x;},
  set x(value) {
    if (isNaN(value)) return;
    this._x = value;
  },
  get y() { return this._y;},
  set y(value) {
    if (isNaN(value)) return;
    this._y = value;
  },
  get z() { return this._z;},
  set z(value) {
    if (isNaN(value)) return;
    this._z = value;
  }
};
