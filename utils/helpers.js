function lerp(a,b,amount){
  if (isNaN(a) || isNaN(b) || isNaN(c)) {
    throw "Linear interpolation available to numbers only";
  }
  return b - amount*(b-a);
}


function smoothTransition(rgba, rgba2, amount) {

  if (rgba == rgba2) {
    return rgba;
  }

  var c1R = (rgba & 0xff);
  var c1G = ((rgba & 0xff00) >> 8);
  var c1B = ((rgba & 0xff0000) >> 16);
  var c1A = ((rgba & 0xff000000) >>> 24);

  var c2R = (rgba2 & 0xff);
  var c2G = ((rgba2 & 0xff00) >> 8);
  var c2B = ((rgba2 & 0xff0000) >> 16);
  var c2A = ((rgba2 & 0xff000000) >>> 24);


  c1A = c1A > c2A ? c1A - amount < c2A ? c2A : c1A - amount : c1A + amount > c2A ? c2A : c1A + amount;
  c1R = c1R > c2R ? c1R - amount < c2R ? c2R : c1R - amount : c1R + amount > c2R ? c2R : c1R + amount;
  c1G = c1G > c2G ? c1G - amount < c2G ? c2G : c1G - amount : c1G + amount > c2G ? c2G : c1G + amount;
  c1B = c1B > c2B ? c1B - amount < c2B ? c2B : c1B - amount : c1B + amount > c2B ? c2B : c1B + amount;

  var result = c1A << 24 | c1B << 16 | c1G << 8 | c1R;
  return result;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
