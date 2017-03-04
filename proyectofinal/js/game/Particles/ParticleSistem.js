define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    require('./Particle.js');

    Kings.ParticleSistem = function(parameters) {
        Kings.GameObject.call(this, parameters);
        this.particles = [];
        this.gravity = parameters.gravity || { x: 0, y: 0, z: 0 };
        this.keepAlive = parameters.keepAlive || false;
        this.lifeSpan = parameters.lifeSpan || 100;
        this.texture = parameters.texture;
        this.size = parameters.size;
    };

    Kings.ParticleSistem.prototype = Object.create(Kings.GameObject.prototype);

    Kings.ParticleSistem.prototype.update = function() {
        Kings.GameObject.prototype.update.call(this);
        if (this.particles.length > 0) {
            for (var i = 0; i < this.particles.length; i++) {
                if(!this.particles[i].update(this.gravity)) {
                    if (this.keepAlive) {
                        this.particles[i].reset();
                    } else {
                        this.particles.splice(i, 1);
                    }
                }
            }
            return true;
        }
        return false;
    };

    Kings.ParticleSistem.prototype.draw = function(camera) {
        if (this.particles.length > 0) {
            for (var i = 0; i < this.particles.length; i++) {
                this.particles[i].draw(camera);
            }
        }
    }
});
