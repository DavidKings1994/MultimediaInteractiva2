define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.OilDrum = function(parameters) {
        parameters.shape = Kings.AssetBundles[0].content.oildrum
        parameters.rotation = { x: 0, y: 0, z: 0 };
        Kings.GameObject.call(this, parameters);
        var self = this;
        this.active = true;
        this.body = new Kings.RigidBody({
            position: this.position,
            rotation: this.rotation,
            size: { x: 2, y: 2, z: 1.3 },
            onCollision: function() {
                if (self.active) {
                    self.explosion = new Kings.ParticleExplosion({
                        particleNumber: 20,
                        lifeSpan: 50,
                        size: 2,
                        position: { x: self.position.x, y: self.position.y, z: self.position.z },
                        gravity: { x: 0, y: 0.005, z: 0 }
                    });
                    self.fire = new Kings.ParticleFire({
                        particleNumber: 20,
                        lifeSpan: 20,
                        size: 2,
                        position: new Kings.Vector({
                            x: self.position.x,
                            y: self.position.y + 1,
                            z: self.position.z
                        }),
                    });
                    Kings.AssetBundles[0].content.explosion.currentTime = 0;
                    Kings.AssetBundles[0].content.explosion.play();
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
        if (this.explosion != undefined) {
            this.explosion.update();
            this.fire.update();
        }
    };

    Kings.OilDrum.prototype.draw = function() {
        if (this.explosion != undefined) {
            this.explosion.draw(Kings.game.camera);
            this.fire.draw(Kings.game.camera);
        } else {
            Kings.GameObject.prototype.draw.call(this);
        }
    };
});
