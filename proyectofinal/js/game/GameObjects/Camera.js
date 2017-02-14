define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.Camera = function(parameters) {
        this.position = parameters.position || { x: 0, y: 0, z: 0 };
        this.rotation = parameters.rotation || { x: 0, y: 0, z: 0 };
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
                glMatrix.vec3.fromValues(0, 1, 0)
            );
        }
    };
});
