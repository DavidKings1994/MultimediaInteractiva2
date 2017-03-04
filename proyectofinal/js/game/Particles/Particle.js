define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.Particle = function(parameters) {
        parameters.shape = new Kings.Plane({
            texture: parameters.texture,
            width: parameters.size,
            height: parameters.size
        });
        Kings.GameObject.call(this, parameters);
        this.direction = parameters.direction;
        this.life = parameters.life || 100;
        this.originalLife = parameters.life || 100;
        this.originalPosition = new Kings.Vector({
            x: this.position.x,
            y: this.position.y,
            z: this.position.z
        });
        this.originalDirection = new Kings.Vector({
            x: this.direction.x,
            y: this.direction.y,
            z: this.direction.z
        });
    };

    Kings.Particle.prototype = Object.create(Kings.GameObject.prototype);

    Kings.Particle.prototype.update = function(gravity) {
        if (this.life > 0) {
            Kings.GameObject.prototype.update.call(this);
            this.direction.x += gravity.x;
            this.direction.y += gravity.y;
            this.direction.z += gravity.z;

            this.position.x += this.direction.x;
            this.position.y += this.direction.y;
            this.position.z += this.direction.z;

            this.life--;
            return true;
        } else {
            return false;
        }
    };

    Kings.Particle.prototype.draw = function(camera) {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        gl.enable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);

        var look = new Kings.Vector({
            x: camera.position.x - this.position.x,
            y: camera.position.y - this.position.y,
            z: camera.position.z - this.position.z
        });

        var cup = new Kings.Vector({ x: camera.up.x, y: camera.up.y, z: camera.up.z});
        var right = cup.crossProduct(look);
        var up = look.crossProduct(right);

        this.rotation.x = right.angleBetweenVectors(
            new Kings.Vector({ x: 1, y: 0, z: 0})
        );
        this.rotation.z = up.angleBetweenVectors(
            new Kings.Vector({ x: 0, y: 1, z: 0})
        );
        this.rotation.y = look.angleBetweenVectors(
            new Kings.Vector({ x: 0, y: 0, z: 1})
        );

        Kings.GL.mvPushMatrix();
        Kings.GL.mvTranslate(this.position);
        Kings.GL.mvRotate(this.rotation.x, 1, 0, 0);
        Kings.GL.mvRotate(this.rotation.y, 0, 1, 0);
        Kings.GL.mvRotate(this.rotation.z, 0, 0, 1);

        this.shape.draw(Kings.game.shaders.basic);

        Kings.GL.mvPopMatrix();

        gl.disable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
    };

    Kings.Particle.prototype.reset = function() {
        this.position = this.originalPosition.clone();
        this.direction = this.originalDirection.clone();
        this.life = (this.originalLife + 0);
    }
});
