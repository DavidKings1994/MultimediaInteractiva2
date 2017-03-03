define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.OilDrum = function(parameters) {
        parameters.shape = Kings.AssetBundles[0].content.oildrum
        Kings.GameObject.call(this, parameters);
        var self = this;
        this.active = true;
        this.body = new Kings.RigidBody({
            position: this.position,
            rotation: this.rotation,
            size: { x: 1.3, y: 2, z: 1.3 },
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

    Kings.OilDrum.prototype = Object.create(Kings.GameObject.prototype);

    Kings.OilDrum.prototype.update = function() {
        Kings.GameObject.prototype.update.call(this);
    };
});
