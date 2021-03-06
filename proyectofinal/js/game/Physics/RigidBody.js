define(['jquery', 'glMatrix', './../Matemathic/Vector'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.RigidBody = function(parameters) {
        this.position = parameters.position || new Kings.Vector();
        this.pastPosition = {
            x: parameters.position.x,
            y: parameters.position.y,
            z: parameters.position.z
        } || { x: 0, y: 0, z: 0 };
        this.rotation = parameters.rotation || { x: 0, y: 0, z: 0};
        this.size = parameters.size || { x: 0, y: 0, z: 0};
        this.callback = parameters.onCollision;
    };

    Kings.RigidBody.prototype = {
        constructor: Kings.RigidBody,

        setPosition: function(position) {
            this.pastPosition = this.position.clone();
            this.position = position.clone();
        },

        // Especifica para el juego unicamente
        continuosCollision: function(body) {
            var movementVector = new Kings.Vector({
                x: body.position.x - body.pastPosition.x,
                y: body.position.y - body.pastPosition.y,
                z: body.position.z - body.pastPosition.z
            });

            if (
                this.position.x - (this.size.x / 2) <= body.position.x + (body.size.x / 2) &&
                this.position.x + (this.size.x / 2) >= body.position.x - (body.size.x / 2)
            ) {
                if (
                    body.pastPosition.z <= this.position.z + (this.size.z / 2) &&
                    body.pastPosition.z + movementVector.z >= this.position.z - (this.size.z / 2)
                ) {
                    if (
                        this.position.y - (this.size.y / 2) <= body.position.y + (body.size.y / 2) &&
                        this.position.y + (this.size.y / 2) >= body.position.y - (body.size.y / 2)
                    ) {
                        if (this.callback !== undefined) {
                            this.callback();
                        }
                        return true;
                    }
                }
            }
            return false;
        },

        checkCollisionWithBody: function(body) {
            if (
                this.position.x - (this.size.x / 2) <= body.position.x + (body.size.x / 2) &&
                this.position.x + (this.size.x / 2) >= body.position.x - (body.size.x / 2)
            ) {
                if (
                    this.position.z - (this.size.z / 2) <= body.position.z + (body.size.z / 2) &&
                    this.position.z + (this.size.z / 2) >= body.position.z - (body.size.z / 2)
                ) {
                    if (
                        this.position.y - (this.size.y / 2) <= body.position.y + (body.size.y / 2) &&
                        this.position.y + (this.size.y / 2) >= body.position.y - (body.size.y / 2)
                    ) {
                        if (this.callback !== undefined) {
                            this.callback();
                        }
                        return true;
                    }
                }
            }
            return false;
        },

        checkCollisionWithLine: function(line, segments) {
            var m = line.end.y - line.start.y / line.end.x - line.start.x;
            var b = line.end.y - (m * line.end.x);
            var lenght = line.end.y - line.start.y;
            var step = lenght / segments;
            for (var i = 0; i < lenght; i+=step) {
                if (line.start.z > this.position.z - (this.size.z / 2) && line.start.z < this.position.z + (this.size.z / 2)) {
                    var x = (i == 0 && b == 0) ? 0 : (line.start.y + i - b) / m;
                    if (x > this.position.x - (this.size.x / 2) && x < this.position.x + (this.size.x / 2)) {
                        var y = i;
                        if (line.start.y + y >= this.position.y && line.start.y + y < this.position.y + this.size.y) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
    };
});
