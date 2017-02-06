define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.GL = {
        loadIdentity: function() {
            Kings.mvMatrix = glMatrix.mat4.create();
        },

        multMatrix: function(m) {
            Kings.mvMatrix = Kings.mvMatrix.mul(m);
        },

        mvTranslate: function(v) {
            multMatrix(glMatrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
        },

        setMatrixUniforms: function() {
            gl.uniformMatrix4fv(Kings.pMatrixUniform, false, Kings.pMatrix);
            gl.uniformMatrix4fv(Kings.mvMatrixUniform, false, Kings.mvMatrix);
        },

        mvPushMatrix: function(m) {
            if (m) {
                var tempMatrix = glMatrix.mat4.create();
                glMatrix.mat4.copy(tempMatrix, Kings.mvMatrix);
                Kings.mvMatrixStack.push(tempMatrix);
                Kings.mvMatrix = tempMatrix;
            } else {
                var tempMatrix = glMatrix.mat4.create();
                glMatrix.mat4.copy(tempMatrix, Kings.mvMatrix);
                Kings.mvMatrixStack.push(tempMatrix);
            }
        },

        mvPopMatrix: function() {
            if (!Kings.mvMatrixStack.length) {
                throw("Can't pop from an empty glMatrix stack.");
            }

            Kings.mvMatrix = Kings.mvMatrixStack.pop();
            return Kings.mvMatrix;
        },

        mvRotate: function(angle, x, y, z) {
            var inRadians = angle * Math.PI / 180.0;
            glMatrix.mat4.rotate(Kings.mvMatrix, Kings.mvMatrix, inRadians, glMatrix.vec3.fromValues(x, y, z));
        },

        lookAt: function(eye, center, up) {
            glMatrix.mat4.lookAt(Kings.mvMatrix, eye, center, up);
        }
    };
});
