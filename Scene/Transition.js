function Transition(delay,duration){
  this.delay = delay;
  this.duration = duration;
  this.onUpdate = null;
  this.onFinish = null;
  this.finished = false;
  this.active = false;
  this._startTime = null;
}

Transition.prototype.Start = function(){
  this.active = true;
  var self = this;
  setTimeout(function() {
    self._startTime = performance.now();
  }, self.delay);

};

Transition.prototype.Update = function(delta){
    if (this.onUpdate && this._startTime) {
      var current = performance.now() - this._startTime;
      if (current > this.duration) {
        if (this.onFinish) {
          this.onFinish();
          return;
        }
        this.finished = true;
        this.active = false;
      }
      var percent = 100*(current/this.duration);
      if (percent > 100) {
        percent = 100;
      }
      console.log(percent);
      this.onUpdate(delta,percent);
    }
};
