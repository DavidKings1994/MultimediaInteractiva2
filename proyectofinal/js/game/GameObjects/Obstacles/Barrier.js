define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.Barrier = function(parameters) {
        parameters.shape = Kings.AssetBundles[0].content.barriere
        parameters.rotation = { x: 0, y: -180, z: 0 };
        Kings.GameObject.call(this, parameters);
        var self = this;
        this.active = true;
        this.body = new Kings.RigidBody({
            position: this.position,
            rotation: this.rotation,
            size: { x: 2, y: 1, z: 0.5 },
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

    Kings.Barrier.prototype = Object.create(Kings.GameObject.prototype);

    Kings.Barrier.prototype.update = function() {
        Kings.GameObject.prototype.update.call(this);
    };
});
