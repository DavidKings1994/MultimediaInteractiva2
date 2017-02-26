define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.RoadSection = function(parameters) {
        this.id = parameters.id;
        this.active = false;
        parameters.rotation = { x: 90, y: 0, z: 0};
        parameters.shape = new Kings.Plane({
            height: parameters.sectionSize,
            width: parameters.sectionSize,
            texture: parameters.texture
        });
        Kings.GameObject.call(this, parameters);
        this.objects = parameters.element || [];
    };

    Kings.RoadSection.prototype = Object.create(Kings.GameObject.prototype);

    Kings.RoadSection.prototype.update = function() {
        Kings.GameObject.prototype.update.call(this);
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].update();
            if (this.active) {
                this.objects[i].body.checkCollisionWithBody(Kings.game.player.body);
            }
        }
    };

    Kings.RoadSection.prototype.draw = function() {
        Kings.GameObject.prototype.draw.call(this);
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].draw();
        }
    };
});
