define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    require('./ParticleSistem.js');

    Kings.ParticleFire = function(parameters) {
        parameters.keepAlive = true;
        Kings.ParticleSistem.call(this, parameters);
        this.right = true;
        for (var i = 0; i < parameters.particleNumber; i++) {
            var direction = {
                x: 0,
                y: Math.random() * 0.1,
                z: 0
            };
            var position = {
                x: this.position.x + (Math.random() - 0.5),
                y: this.position.y + (Math.random() - 0.5),
                z: this.position.z + (Math.random() - 0.5)
            }
            this.particles[i] = new Kings.Particle({
                texture: Kings.AssetBundles[0].content.fireParticle,
                position: position,
                direction: direction,
                life: this.lifeSpan * (Math.random() + 0.1),
                size: this.size
            });
        }
    };

    Kings.ParticleFire.prototype = Object.create(Kings.ParticleSistem.prototype);

    Kings.ParticleFire.prototype.update = function() {
        Kings.ParticleSistem.prototype.update.call(this);
        var t = Math.random();
        if (this.right) {
            if (t > 0.9) {
                this.gravity.x = 0.01;
                this.right = false;
            }
        } else {
            if (t > 0.9) {
                this.gravity.x = -0.01;
                this.right = true;
            }
        }
    };
});
