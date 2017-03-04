define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    require('./ParticleSistem.js');

    Kings.ParticleExplosion = function(parameters) {
        Kings.ParticleSistem.call(this, parameters);
        for (var i = 0; i < parameters.particleNumber; i++) {
            var direction = {
                x: (Math.random() - 0.5) * 0.7,
                y: (Math.random() - 0.5) * 0.7,
                z: (Math.random() - 0.5) * 0.7
            };
            this.particles[i] = new Kings.Particle({
                texture: Kings.AssetBundles[0].content.explosionParticle,
                position: { x: this.position.x, y: this.position.y + 1, z: this.position.z },
                direction: direction,
                life: this.lifeSpan,
                size: this.size
            });
        }
    };

    Kings.ParticleExplosion.prototype = Object.create(Kings.ParticleSistem.prototype);
});
