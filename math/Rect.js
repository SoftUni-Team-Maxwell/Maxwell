function Rect(x, y, width, heigth) {
  if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(heigth)) {
    throw 'Cannot construct Vec3 from non number variables';
  }
  this._x = x;
  this._y = y;
  this._width = width;
  this._height = heigth;
}

Rect.prototype = {
  get x() {
    return this._x;
  },
  set x(value) {
    if (isNaN(value)) return;
    this._x = value;
  },
  get y() {
    return this._y;
  },
  set y(value) {
    if (isNaN(value)) return;
    this._y = value;
  },
  get width() {
    return this._width;
  },
  set width(value) {
    if (isNaN(value)) return;
    this._width = value;
  },
  get height() {
    return this._height;
  },
  set height(value) {
    if (isNaN(value)) return;
    this._height = value;
  }
};
