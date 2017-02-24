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
        this.objects = [];
        this.gas = new Kings.Gasoline({
            position: { x: this.position.x, y: this.position.y, z: this.position.z }
        });
    };

    Kings.RoadSection.prototype = Object.create(Kings.GameObject.prototype);

    Kings.RoadSection.prototype.update = function() {
        Kings.GameObject.prototype.update.call(this);
        if (this.gas != null) {
            this.gas.position.z = this.position.z;
            this.gas.update();
            if (this.active) {
                // var col = this.gas.body.checkCollisionWithLine({
                //     start: {
                //         x: Kings.game.player.position.x,
                //         y: Kings.game.player.position.y,
                //         z: Kings.game.player.position.z
                //     },
                //     end: {
                //         x: Kings.game.player.position.x,
                //         y: Kings.game.player.position.y + 1,
                //         z: Kings.game.player.position.z
                //     }
                // }, 10);
                var col = this.gas.body.checkCollisionWithBody(Kings.game.player.body);
                if (col) {
                    this.gas = null;
                }
            }
        }
    };

    Kings.RoadSection.prototype.draw = function() {
        Kings.GameObject.prototype.draw.call(this);
        if (this.gas != null) {
            this.gas.draw();
        }
    };
});
