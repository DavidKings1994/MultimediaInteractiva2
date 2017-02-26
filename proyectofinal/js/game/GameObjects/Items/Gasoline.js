define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.Gasoline = function(parameters) {
        var self = this;
        parameters.shape = Kings.AssetBundles[0].content.Gas
        Kings.GameObject.call(this, parameters);
        this.hovering = true;
        this.content = 5;
        this.active = true;
        this.body = new Kings.RigidBody({
            position: this.position,
            rotation: this.rotation,
            size: { x: 0.5, y: 0.7, z: 0.5 },
            onCollision: function() {
                if (self.active) {
                    Kings.AssetBundles[0].content.currentTime = 0;
                    Kings.AssetBundles[0].content.bubbling.play();
                    Kings.game.player.fillTank(self.content);
                    self.active = false;
                }
            }
        });
    };

    Kings.Gasoline.prototype = Object.create(Kings.GameObject.prototype);

    Kings.Gasoline.prototype.update = function() {
        Kings.GameObject.prototype.update.call(this);
        this.rotation.y += 0.5;
        if (this.hovering) {
            if (this.position.y < -1.4) {
                this.position.y += 0.01;
            } else {
                this.hovering = false;
            }
        } else {
            if (this.position.y > -1.8) {
                this.position.y -= 0.01;
            } else {
                this.hovering = true;
            }
        }
    };

    Kings.Gasoline.prototype.draw = function() {
        if (this.active) {
            Kings.GameObject.prototype.draw.call(this);
        }
    };
});
