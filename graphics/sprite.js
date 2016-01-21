function Sprite(gl, vec3Pos, vec2size, texture, texCoords, colors) {
  // NOTE(Inspix): Useful and needed members
  this.glContext = gl;
  this.texture = texture;

  // NOTE(Inspix): Sprite transformation variables.
  this.width = vec2size.x || 1;
  this.height = vec2size.y || 1;
  this.transform = new Mat4(1);
  this.position = vec3Pos || new Vec3(0, 0, 0);
  this.rotation = 0;
  this.scale = new Vec3(1, 1, 1);
  this.origin = new Vec2(0,0);

  // TODO: Create getters/setters where needed.

}
