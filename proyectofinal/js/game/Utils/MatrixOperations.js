define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.GL = {
        loadIdentity: function() {
            Kings.mvMatrix = glMatrix.mat4.create();
        },

        multMatrix: function(m) {
            Kings.mvMatrix = Kings.mvMatrix.mul(m);
        },

        setMatrixUniforms: function(shader) {
            gl.uniformMatrix4fv(shader.getUniform('uPMatrix'), false, Kings.pMatrix);
            gl.uniformMatrix4fv(shader.getUniform('uMVMatrix'), false, Kings.mvMatrix);

            var normalMatrix = glMatrix.mat3.create();
            glMatrix.mat3.fromMat4(normalMatrix, Kings.mvMatrix);
            glMatrix.mat3.invert(normalMatrix, normalMatrix);
            glMatrix.mat3.transpose(normalMatrix, normalMatrix);
            gl.uniformMatrix3fv(shader.getUniform('uNMatrix'), false, normalMatrix);
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

        mvTranslate: function(v) {
            glMatrix.mat4.translate(Kings.mvMatrix, Kings.mvMatrix, glMatrix.vec3.fromValues(v.x, v.y, v.z));
        },

        mvScale: function(v) {
            glMatrix.mat4.scale(Kings.mvMatrix, Kings.mvMatrix, glMatrix.vec3.fromValues(v.x, v.y, v.z));
        },

        lookAt: function(eye, center, up) {
            glMatrix.mat4.lookAt(Kings.mvMatrix, eye, center, up);
        }
    };
});
