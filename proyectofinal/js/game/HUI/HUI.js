define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.HUI = function(parameters) {
        this.elements = [];
    };

    Kings.HUI.prototype = {
        constructor: Kings.HUI,

        addElement: function(element) {
            if (element != null) {
                this.elements.push(element);
            }
        },

        update: function() {
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].update();
            }
        },

        draw: function() {
            var ratio = gl.canvas.width / gl.canvas.height;
            glMatrix.mat4.identity(Kings.pMatrix);
            glMatrix.mat4.ortho(Kings.pMatrix, -10.0 - ratio, 10.0 + ratio, -10.0 + ratio, 10.0  - ratio, 0.1, 100.0);

            Kings.GL.mvPushMatrix();
            Kings.GL.lookAt(
                glMatrix.vec3.fromValues(0,0,1),
                glMatrix.vec3.fromValues(0,0,0),
                glMatrix.vec3.fromValues(0, 1, 0)
            );

            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.enable(gl.BLEND);
            gl.disable(gl.DEPTH_TEST);
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].draw();
            }
            gl.disable(gl.BLEND);
            gl.enable(gl.DEPTH_TEST);
            Kings.GL.mvPopMatrix();
            glMatrix.mat4.perspective(Kings.pMatrix, 45, ratio, 0.1, 200.0);
        }
    };
});
