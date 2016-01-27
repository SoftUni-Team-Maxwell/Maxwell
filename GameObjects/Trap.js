function Trap(x,texture,type){
    this.boundingBox = this.GenerateBoundingBox(x,type);
    this.texture = texture;
    this.type = type;
    this.onScreen = true;
    this.hit = false;
    this.lifeTime = 35;
}

Trap.prototype = {
    constructor : Trap,
    get x() { return this.boundingBox.x;},
    set x(value) {
        if (isNaN(value)) {
            return;
        }
        this.boundingBox.x = value;
    },
    get y() { return this.boundingBox.y;},
    set y(value) {
        if (isNaN(value)) {
            return;
        }
        this.boundingBox.y = value;
    },
    get width() {
        return this.boundingBox.width;
    },
    get height() {
        return this.boundingBox.height;
    },
    get BoundingBox(){
        return this.boundingBox;
    },
    CheckCollision : function(rect,shrink){

        var result = AARectColiding(this.boundingBox,rect,shrink);
        if (result === true) {
            console.log("TRAP HITTT");
        }
        return result;
    },
    GenerateBoundingBox : function(x,type) {
        if(type ==='line'){
            return new Rect(x, 150, 200, 200);
        }
        return new Rect(x, 300, 400, 400);

    },

};
