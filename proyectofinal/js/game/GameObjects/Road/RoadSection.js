define(['jquery', 'glMatrix', './../../../store/store'],  function($, glMatrix, store) {
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
                if (store.state.gameOver) {
                    this.orderDepth(Kings.game.camera);
                }
            }
        }
    };

    Kings.RoadSection.prototype.draw = function() {
        Kings.GameObject.prototype.draw.call(this);
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].draw();
        }
    };

    Kings.RoadSection.prototype.orderDepth = function(camera) {
        for (var i = 0; i < this.objects.length; i++) {
            var vec = new Kings.Vector({
                x: camera.position.x - this.objects[i].position.x,
                y: camera.position.y - this.objects[i].position.y,
                z: camera.position.z - this.objects[i].position.z
            });
            this.objects[i].distance = vec.magnitude();
        }
        this.objects.sort(function(a,b) {
            return (b.distance - a.distance);
        });
    };
});
