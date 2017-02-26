define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.Cone = function(parameters) {
        parameters.shape = Kings.AssetBundles[0].content.cone
        Kings.GameObject.call(this, parameters);
        var self = this;
        this.active = true;
        this.body = new Kings.RigidBody({
            position: this.position,
            rotation: this.rotation,
            size: { x: 0.5, y: 0.7, z: 0.5 },
            onCollision: function() {
                if (self.active) {
                    Kings.game.player.drainTank(30);
                    self.active = false;
                }
            }
        });
        this.hovering = true;
        this.content = 5;
    };

    Kings.Cone.prototype = Object.create(Kings.GameObject.prototype);

    Kings.Cone.prototype.update = function() {
        Kings.GameObject.prototype.update.call(this);
    };
});
