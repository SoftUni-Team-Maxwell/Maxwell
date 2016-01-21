function Transition(delay,duration){
  this.delay = delay;
  this.duration = duration;
  this.onUpdate = null;
  this.onFinish = null;
  this._startTime = null;
}

Transition.prototype.Start = function(){
  setTimeout(function() {
    this._startTime = performance.now();
  }, this.delay);

};

Transition.prototype.Update = function(delta){
    if (this.onUpdate && this._startTime) {
      if (performance.now() - this._startTime > this.duration) {
        if (this.onFinish) {
          this.onFinish();
          return;
        }
      }
      this.onUpdate(delta);
    }
};
