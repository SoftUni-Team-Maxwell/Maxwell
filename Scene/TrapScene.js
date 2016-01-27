function TrapScene(glContext){
    SceneNode.call(this,glContext);

    this.traps = [];
    this.nextTrapX=1500;
    this.activeTraps = [];
    this.globalOptions = {
        'rotation': 0,
        'color': 0xffffffff,
        'depth': 0
    };
}

TrapScene.prototype = Object.create(SceneNode.prototype);

TrapScene.prototype.Init = function() {
    this.traps.push(ASSETMANAGER.textures.lineTrap);
    this.traps.push(ASSETMANAGER.textures.blockTrap);
    this.activeTraps.push(new Trap(500,this.traps[0],'line'));
    this.activeTraps.push(new Trap(1500,this.traps[1],'block'));

};

TrapScene.prototype.InitTraps = function(){
    this.activeTraps.push(new Trap(this.nextTrapX,this.traps[1],'block'));
};

TrapScene.prototype.UpdateSelf = function(delta){
    this.nextTrapX+=5;
    if(this.activeTraps.length<=2){
        this.InitTraps();
    }
    var activeTraps = this.activeTraps;
    if (activeTraps.length > 0) {
        var self = this;
        for (var i = 0; i < activeTraps.length; i++) {
            var b = activeTraps[i];
            if (b.onScreen && !b.hit && b.x > self.playerRect.left && b.x < self.playerRect.right ) {
                var result = b.CheckCollision(self.playerRect,20);
                if (result) {
                    console.log("Game Over");
                }
            }
        }
    }
};

TrapScene.prototype.DrawSelf = function(batch) {
    var activeTraps = this.activeTraps;
    if (activeTraps.length > 0) {
        this.gl.defaultShader.setUniformMat4(this.camera.Matrix, this.gl.defaultShader.uLocations.uVwMatrix);
        this.gl.defaultFontShader.setUniformMat4(this.camera.Matrix, this.gl.defaultFontShader.uLocations.uVwMatrix);
        var self = this;
        for (var i = 0; i < activeTraps.length; i++) {
            var b = activeTraps[i];
            if (b.onScreen && b.x > self.camera.x - b.width && b.x < self.camera.x + CANVAS.width) {
                self.globalOptions.destinationRectangle = b.BoundingBox;
                self.globalOptions.originX = b.width / 2;
                self.globalOptions.originY = b.height / 2;
                batch.DrawTexture(b.texture, self.globalOptions);
            }else if(b.onScreen && b.x < self.camera.x) {
                b.onScreen = false;
                activeTraps.splice(i, 1);
                i--;
            }
        }
        this.gl.defaultShader.setUniformMat4(Identity, this.gl.defaultShader.uLocations.uVwMatrix);
        this.gl.defaultFontShader.setUniformMat4(Identity, this.gl.defaultFontShader.uLocations.uVwMatrix);
    }
};