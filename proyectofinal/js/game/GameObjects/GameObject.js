define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.GameObject = function(parameters) {
        this.position = parameters.position;
        this.rotation = parameters.rotation;
        this.scale = parameters.scale;
        this.shape = parameters.shape || null;
        this.texture = parameters.texture || null;
    };

    Kings.GameObject.prototype = {
        constructor: Kings.GameObject,

        update: function() {

        },

        draw: function() {
            Kings.GL.mvPushMatrix();
            Kings.GL.mvTranslate(this.position);
            Kings.GL.mvRotate(this.rotation.x, 1, 0, 0);
            Kings.GL.mvRotate(this.rotation.y, 0, 1, 0);
            Kings.GL.mvRotate(this.rotation.z, 0, 0, 1);

            this.shape.draw();

            Kings.GL.mvPopMatrix();
        }
    };
});
