define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.GameObject = function(parameters) {
        this.position = parameters.position || { x: 0, y: 0, z: 0 };
        this.rotation = parameters.rotation || { x: 0, y: 0, z: 0 };
        this.scale = parameters.scale;
        this.shape = parameters.shape || null;
        this.texture = parameters.texture || null;
        this.updates = [];
    };

    Kings.GameObject.prototype = {
        constructor: Kings.GameObject,

        removeUpdateFunction: function(index) {
            this.updates.splice(index, 1);
        },

        addUpdateFunction: function(callback) {
            var f = function(){
                return function(){
                    callback();
                };
            };
            this.updates.push(f());
            return this.updates.length - 1;
        },

        update: function() {
            for (var i = 0; i < this.updates.length; i++) {
                this.updates[i]();
            }
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
