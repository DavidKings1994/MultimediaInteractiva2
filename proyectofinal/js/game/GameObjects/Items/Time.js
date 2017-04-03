define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.Time = function(parameters) {
        var self = this;
        parameters.shape = new Kings.Cube({
            texture: Kings.AssetBundles[0].content.watch,
            size: 1
        });
        Kings.GameObject.call(this, parameters);
        this.hovering = true;
        this.hoverAltitude = 0;
        this.content = 20;
        this.active = true;
        this.body = new Kings.RigidBody({
            position: this.position,
            rotation: this.rotation,
            size: { x: 1, y: 0.7, z: 1 },
            onCollision: function() {
                if (self.active) {
                    Kings.AssetBundles[0].content.time.currentTime = 0;
                    Kings.AssetBundles[0].content.time.play();
                    Kings.game.player.fillTime(self.content);
                    self.active = false;
                }
            }
        });
    };

    Kings.Time.prototype = Object.create(Kings.GameObject.prototype);

    Kings.Time.prototype.update = function() {
        Kings.GameObject.prototype.update.call(this);
        this.rotation.y += 0.5;
        if (this.hovering) {
            if (this.hoverAltitude < 0.2) {
                this.hoverAltitude += 0.01;
                this.position.y += 0.01;
            } else {
                this.hovering = false;
            }
        } else {
            if (this.hoverAltitude > -0.2) {
                this.hoverAltitude -= 0.01;
                this.position.y -= 0.01;
            } else {
                this.hovering = true;
            }
        }
    };

    Kings.Time.prototype.draw = function() {
        if (this.active) {
            Kings.GameObject.prototype.draw.call(this);
        }
    };
});
