function AssetManager(glContext){
  this.gl = glContext;
  this.images = [];
  this.textures = {};
  this.sounds = {};
  this.song = {};
  this.sprites = {};
  this.fonts = {};
  this.queue = {
    textures: [],
    sprites : [],
    sounds : [],
    songs : [],
    fonts : [],
  };
  this.loaded = 0;
  this.total = 0;
}

AssetManager.prototype = {
  constructor: AssetManager,
  AddTexture: function(id,texture){
    this.textures[id] = texture;
  },
  AddSound: function(id,sound){
    this.sounds[id] = sound;
  },
  AddSong: function(id,song){
    this.song[id] = song;
  },
  AddSprite: function(id,sprite){
    this.sprites[id] = sprite;
  },
  AddFont: function(id,font){
    this.sprites[id] = font;
  },
  QueueToLoadTexture: function(id,imageUrl){
    this.queue.textures.push({'id' : id, url : imageUrl});
  },
  QueueToLoadSound: function(id,soundUrl){
    this.queue.sounds.push({'id' : id, url : soundUrl});
  },
  QueueToLoadSong: function(id,songUrl){
    this.queue.song.push({'id' : id, url : songUrl});
  },
  QueueToLoadSprite: function(id,textureId,options){
    this.queue.sprites.push({'id' : id, texId:textureId,'options' : options});
  },
  QueueToLoadFont: function(id,fontUrl){
    this.queue.fonts.push({'id':id,url:fontUrl});
  },
  Load : function(onFinish){
    var q = this.queue;
    this.total = q.textures.length + q.songs.length + q.sounds.length + q.fonts.length + q.sprites.length;
    this.loaded = 0;
    for (var i = 0; i < q.textures.length; i++) {
      var item = q.textures[i];
      // TODO(Inspix): Fix loading issues..due to no function creation in loop shananigans...
      this.images[i] = new Image();
      this.loaded++;
      this.onProgressUpdate(100*(this.loaded/this.total),'textures/'+item.id);
      this.textures[item.id] = new Texture(GL,this.images[i]);
      this.images[i].src = item.src;
    }
    for (var s = 0; s < q.sounds.length; s++) {
      // TODO(Inspix): Load sounds;
    }
    for (var snd = 0; snd < q.songs.length; snd++) {
      // TODO(Inspix): Load songs;
    }
    for (var sp = 0; sp < q.sprites.length; sp++) {
      var sprite = q.sprites[sp];
      //function Sprite(gl, vec3Pos, vec2size, texture, texCoords, colors) {
      var position = sprite.options.position || new Vec3(0,0,0);
      var size = sprite.options.size || new Vec2(100,100);

      this.sprites[sprite.id] = new Sprite(GL,position,size,this.textures[sprite.textureId]);
      this.loaded++;
      this.onProgressUpdate(100*(this.loaded/this.total),'sprites/' + sprite.id);
    }
    for (var f = 0; f < q.fonts.length; f++) {
      var font = q.fonts[f];
      // TODO(Inspix): Fix loading issues..due to no function creation in loop shananigans...
      var current = new SpriteFont(GL,font.url);
      this.loaded++;
      this.onProgressUpdate(100*(this.loaded/this.total),'fonts/' + font.id);
      this.fonts[font.id] = current;
    }
  },
  ReleaseTexture: function(id,texture){
    this.textures[id].Release();
  },
  ReleaseSound: function(id,sound){
    this.sounds[id].Release();
  },
  ReleaseSong: function(id,song){
    this.song[id].Release();
  },
  ReleaseSprite: function(id,sprite){
    this.sprites[id] = sprite;
  },
  ReleaseFont: function(id,font){
    this.sprites[id].Release();
  },
  onProgressUpdate : function(percent,msg){
    throw 'not implemented';
  }
};