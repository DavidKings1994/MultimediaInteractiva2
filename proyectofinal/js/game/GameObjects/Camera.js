define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.Camera = function(parameters) {
        this.position = parameters.position || { x: 0, y: 0, z: 0 };
        this.rotation = parameters.rotation || { x: 0, y: 0, z: 0 };
        this.up = parameters.up || { x: 0, y: 1, z: 0 }
        this.aim = parameters.aim || { x: 0, y: 0, z: 10 };
    };

    Kings.Camera.prototype = {
        constructor: Kings.Camera,

        setPosition: function(v) {
            this.position = { x: v.x, y: v.y, z: v.z};
        },

        rotate: function() {

        },

        update: function() {
            Kings.GL.lookAt(
                glMatrix.vec3.fromValues(this.position.x, this.position.y, this.position.z),
                glMatrix.vec3.fromValues(this.position.x + this.aim.x, this.position.y + this.aim.y, this.position.z + this.aim.z),
                glMatrix.vec3.fromValues(this.up.x, this.up.y, this.up.z)
            );

            glMatrix.mat4.lookAt(
                Kings.vMatrix,
                glMatrix.vec3.fromValues(this.position.x, this.position.y, this.position.z),
                glMatrix.vec3.fromValues(this.position.x + this.aim.x, this.position.y + this.aim.y, this.position.z + this.aim.z),
                glMatrix.vec3.fromValues(this.up.x, this.up.y, this.up.z)
            );

            glMatrix.mat4.translate(Kings.wMatrix, Kings.wMatrix, glMatrix.vec3.fromValues(
                this.position.x,
                this.position.y,
                this.position.z
            ));
            var inRadians = glMatrix.vec3.angle(
                glMatrix.vec3.fromValues(
                    this.position.x + this.aim.x,
                    this.position.y + this.aim.y,
                    this.position.z + this.aim.z
                ),
                glMatrix.vec3.fromValues(
                    this.position.x,
                    this.position.y,
                    this.position.z + 10
                )
            );
            glMatrix.mat4.rotate(Kings.wMatrix, Kings.wMatrix, inRadians, glMatrix.vec3.fromValues(0, 1, 0));
            glMatrix.mat4.invert(Kings.wMatrix, Kings.wMatrix);
        }
    };
});
