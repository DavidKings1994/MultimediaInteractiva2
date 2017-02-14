define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.Player = function(parameters) {
        Kings.GameObject.call(this, parameters);
        this.velocity = parameters.velocity || 1;
        this.camera = parameters.camera;
    };

    Kings.Player.prototype = Object.create(Kings.GameObject.prototype);

    Kings.Player.prototype.update = function() {
        this.position.z += this.velocity;
        this.camera.position.z = this.position.z;
        var estado = {
            up: 0,
            down: 0,
            left: 0,
            right: 0
        }
        if (Kings.keyboard.isDown(Kings.keyboard.keys.UP) || Kings.keyboard.isDown(Kings.keyboard.keys.W)) {
            if (Kings.keyboard.current == Kings.keyboard.keys.UP || Kings.keyboard.current == Kings.keyboard.keys.W) {
                this.velocity += 0.1;
            }
        }
        if (Kings.keyboard.isDown(Kings.keyboard.keys.LEFT) || Kings.keyboard.isDown(Kings.keyboard.keys.A)) {
            if (Kings.keyboard.current == Kings.keyboard.keys.LEFT || Kings.keyboard.current == Kings.keyboard.keys.A) {
                this.moveLeft();
            }
        }
        if (Kings.keyboard.isDown(Kings.keyboard.keys.DOWN) || Kings.keyboard.isDown(Kings.keyboard.keys.S)) {
            if (Kings.keyboard.current == Kings.keyboard.keys.DOWN || Kings.keyboard.current == Kings.keyboard.keys.S) {
                this.velocity -= 0.1;
            }
        }
        if (Kings.keyboard.isDown(Kings.keyboard.keys.RIGHT) || Kings.keyboard.isDown(Kings.keyboard.keys.D)) {
            if (Kings.keyboard.current == Kings.keyboard.keys.RIGHT || Kings.keyboard.current == Kings.keyboard.keys.D) {
                this.moveRight();
            }
        }
    }

    Kings.Player.prototype.moveLeft = function() {
        this.position.x += 0.4;
    }

    Kings.Player.prototype.moveRight = function() {
        this.position.x -= 0.4;
    }
});
