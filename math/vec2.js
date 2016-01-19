function Vec2(a,b){
  if (isNaN(a) || isNaN(b)) {
    throw 'Cannot construct Vec2 from non number variables';
  }

  this._x = a;
  this._y = b;
  this.add = function(other){
    if (other instanceof Vec2) {
      this._x += other.x;
      this._y += other.y;
    }
  };

  this.substract = function(other){
    if(other instanceof Vec2){
      this._x -= other.x;
      this._y -= other.y;
    }
  };

  this.multiply = function(other){
    if(other instanceof Vec2){
      this._x *= other.x;
      this._y *= other.y;
    }
  };

  this.divide = function(other){
    if (other instanceof Vec2) {
      this._x /= other.x;
      this._y /= other.y;
    }
  };

  this.addCopy = function(other){
    if (other instanceof Vec2) {
      var result = new Vec2(this._x + other.x, this._y + other.y);
      return result;
    }
  };

  this.substractCopy = function(other){
    if (other instanceof Vec2) {
      var result = new Vec2(this._x - other.x, this._y - other.y);
      return result;
    }
  };

  this.multiplyCopy = function(other){
    if (other instanceof Vec2) {
      var result = new Vec2(this._x * other.x, this._y * other.y);
      return result;
    }
  };

  this.divideCopy = function(other){
    if (other instanceof Vec2) {
      var result = new Vec2(this._x / other.x, this._y / other.y);
      return result;
    }
  };

  this.toArray = function(){
    return new Float32Array([x,y]);
  };

  this.toString = function(){
    return 'Vec2[' + this._x + ', ' + this._y;
  };
}

Vec2.prototype = {
  get x() { return this._x;},
  set x(value) {
    if (isNaN(value)) return;
    this._x = value;
  },
  get y() { return this._y;},
  set y(value) {
    if (isNaN(value)) return;
    this._y = value;
  }
};
