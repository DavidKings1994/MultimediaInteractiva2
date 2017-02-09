define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    require('./../Utils/TextureLoader.js');

    Kings.Triangle = function(parameters) {
        this.color = parameters.color || null;
        this.texture = parameters.texture || null;
        if (this.texture != null) {
            Kings.Texture.SetCurrentTexture(this.texture);
            this.vertexPositionAttribute = Kings.textureShader.getAttributeLocation('aVertexPosition');
            gl.enableVertexAttribArray(this.vertexPositionAttribute);
            this.textureCoordAttribute = Kings.textureShader.getAttributeLocation('aTextureCoord');
            gl.enableVertexAttribArray(this.textureCoordAttribute);
        } else {
            this.vertexPositionAttribute = Kings.colorShader.getAttributeLocation('aVertexPosition');
            gl.enableVertexAttribArray(this.vertexPositionAttribute);
            this.vertexColorAttribute = Kings.colorShader.getAttributeLocation('aVertexColor');
            gl.enableVertexAttribArray(this.vertexColorAttribute);
        }
        this.initBuffers();
        this.angle = 0;
    };

    Kings.Triangle.prototype = {
        constructor: Kings.Triangle,

        initBuffers: function() {
            if (this.texture != null) {
                this.triangleTextureCoordBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleTextureCoordBuffer);
                var textureCoords = [
                    0.0, 0.0,
                    1.0, 0.0,
                    0.5, 1.0,
                ];
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
                this.triangleTextureCoordBuffer.itemSize = 2;
                this.triangleTextureCoordBuffer.numItems = 3;

            } else {
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
            }

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
        },

        update: function() {
            this.angle += 0.3;
        },

        draw: function() {
            Kings.GL.mvPushMatrix();
            Kings.GL.mvRotate(this.angle, 1, 0, 1);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
            gl.vertexAttribPointer(this.vertexPositionAttribute, this.triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            if (this.texture != null) {
                gl.useProgram(Kings.textureShader.getProgram());
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.uniform1i(Kings.textureShader.getProgram().samplerUniform, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleTextureCoordBuffer);
                gl.vertexAttribPointer(this.textureCoordAttribute, this.triangleTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

                Kings.GL.setMatrixUniforms(Kings.textureShader);
            } else {
                gl.useProgram(Kings.colorShader.getProgram());
                gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
                gl.vertexAttribPointer(this.vertexColorAttribute, this.triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

                Kings.GL.setMatrixUniforms(Kings.colorShader);
            }

            gl.drawArrays(gl.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);

            Kings.GL.mvPopMatrix();
        }
    };
});
