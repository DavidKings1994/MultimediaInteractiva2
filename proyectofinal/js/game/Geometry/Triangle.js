define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.Triangle = function(parameters) {
        this.initBuffers();
        this.vertexPositionAttribute = parameters.vertexPositionAttribute;
        this.vertexColorAttribute = parameters.vertexColorAttribute;
        this.angle = 0;
    };

    Kings.Triangle.prototype = {
        constructor: Kings.Triangle,

        initBuffers: function() {
            this.triangleVertexPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
            var vertices = [
                 0.0,  1.0,  0.0,
                -1.0, -1.0,  0.0,
                 1.0, -1.0,  0.0
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            this.triangleVertexPositionBuffer.itemSize = 3;
            this.triangleVertexPositionBuffer.numItems = 3;

            this.triangleVertexColorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
            var colors = [
                1.0, 0.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
                0.0, 0.0, 1.0, 1.0,
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
            this.triangleVertexColorBuffer.itemSize = 4;
            this.triangleVertexColorBuffer.numItems = 3;
        },

        update: function() {
            this.angle += 0.3;
        },

        draw: function() {
            Kings.GL.mvPushMatrix();
            Kings.GL.mvRotate(this.angle, 1, 0, 1);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
            gl.vertexAttribPointer(this.vertexPositionAttribute, this.triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
            gl.vertexAttribPointer(this.vertexColorAttribute, this.triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

            Kings.GL.setMatrixUniforms();
            gl.drawArrays(gl.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);

            Kings.GL.mvPopMatrix();
        }
    };
});
