define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    require('./../Utils/TextureLoader.js');

    Kings.Triangle = function(parameters) {
        this.position = parameters.position || { x: 0, y: 0, z: 0 };
        this.rotation = parameters.rotation || { x: 0, y: 0, z: 0 };
        this.width = parameters.width || 1;
        this.height = parameters.height || 1;
        this.color = parameters.color || { r: 1, g: 1, b: 1, a: 1 };
        this.texture = parameters.texture || null;
        if (this.texture != null) {
            this.vertexPositionAttribute = Kings.textureShader.getAttributeLocation('aVertexPosition');
            gl.enableVertexAttribArray(this.vertexPositionAttribute);
            this.textureCoordAttribute = Kings.textureShader.getAttributeLocation('aTextureCoord');
            gl.enableVertexAttribArray(this.textureCoordAttribute);
            this.vertexNormalAttribute = Kings.textureShader.getAttributeLocation('aVertexNormal');
            gl.enableVertexAttribArray(this.vertexNormalAttribute);
            Kings.Texture.handleTexture(this.texture);
        } else {
            this.vertexPositionAttribute = Kings.colorShader.getAttributeLocation('aVertexPosition');
            gl.enableVertexAttribArray(this.vertexPositionAttribute);
            this.vertexColorAttribute = Kings.colorShader.getAttributeLocation('aVertexColor');
            gl.enableVertexAttribArray(this.vertexColorAttribute);
            this.vertexNormalAttribute = Kings.textureShader.getAttributeLocation('aVertexNormal');
            gl.enableVertexAttribArray(this.vertexNormalAttribute);
        }
        this.initBuffers();
    };

    Kings.Triangle.prototype = {
        constructor: Kings.Triangle,

        initBuffers: function() {
            if (this.texture != null) {
                this.triangleTextureCoordBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleTextureCoordBuffer);
                var textureCoords = [
                    0.5, 1.0,
                    0.0, 0.0,
                    1.0, 0.0,
                ];
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
                this.triangleTextureCoordBuffer.itemSize = 2;
                this.triangleTextureCoordBuffer.numItems = 3;

            } else {
                this.triangleVertexColorBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
                var colors = [
                    this.color.r, this.color.g, this.color.b, this.color.a,
                    this.color.r, this.color.g, this.color.b, this.color.a,
                    this.color.r, this.color.g, this.color.b, this.color.a,
                ];
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
                this.triangleVertexColorBuffer.itemSize = 4;
                this.triangleVertexColorBuffer.numItems = 3;
            }

            this.triangleVertexPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
            var vertices = [
                this.position.x, this.position.y + this.height, this.position.z,
                this.position.x + this.width, this.position.y - this.height, this.position.z,
                this.position.x - this.width, this.position.y - this.height, this.position.z,
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            this.triangleVertexPositionBuffer.itemSize = 3;
            this.triangleVertexPositionBuffer.numItems = 3;

            this.triangleVertexNormalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexNormalBuffer);
            var vertexNormals = [
                0.0,  0.0,  1.0,
                0.0,  0.0,  1.0,
                0.0,  0.0,  1.0,
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
            this.triangleVertexNormalBuffer.itemSize = 3;
            this.triangleVertexNormalBuffer.numItems = 3;
        },

        update: function() {

        },

        draw: function() {
            Kings.GL.mvPushMatrix();
            Kings.GL.mvTranslate(this.position);
            Kings.GL.mvRotate(this.rotation.x, 1, 0, 0);
            Kings.GL.mvRotate(this.rotation.y, 0, 1, 0);
            Kings.GL.mvRotate(this.rotation.z, 0, 0, 1);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexPositionBuffer);
            gl.vertexAttribPointer(this.vertexPositionAttribute, this.triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexNormalBuffer);
            gl.vertexAttribPointer(this.vertexNormalAttribute, this.triangleVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

            if (this.texture != null) {
                gl.useProgram(Kings.textureShader.getProgram());
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.uniform1i(Kings.textureShader.getProgram().samplerUniform, 0);

                gl.uniform3f(Kings.textureShader.getUniform('uAmbientColor'),
                    Kings.game.light.ambiental[0],
                    Kings.game.light.ambiental[1],
                    Kings.game.light.ambiental[2]
                );
                var adjustedLD = glMatrix.vec3.create();
                glMatrix.vec3.normalize(adjustedLD, Kings.game.light.directional.direction);
                gl.uniform3fv(Kings.textureShader.getUniform('uLightingDirection'), adjustedLD);
                gl.uniform3f(Kings.textureShader.getUniform('uDirectionalColor'),
                    Kings.game.light.directional.color[0],
                    Kings.game.light.directional.color[1],
                    Kings.game.light.directional.color[2]
                );

                gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleTextureCoordBuffer);
                gl.vertexAttribPointer(this.textureCoordAttribute, this.triangleTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

                Kings.GL.setMatrixUniforms(Kings.textureShader);
            } else {
                gl.useProgram(Kings.colorShader.getProgram());
                gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleVertexColorBuffer);
                gl.vertexAttribPointer(this.vertexColorAttribute, this.triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

                gl.uniform3f(Kings.textureShader.getUniform('uAmbientColor'), 1.0, 1.0, 1.0);
                var lightingDirection = [0.0, -1.0, -1.0];
                var adjustedLD = glMatrix.vec3.create();
                glMatrix.vec3.normalize(adjustedLD, lightingDirection);
                gl.uniform3fv(Kings.textureShader.getUniform('uLightingDirection'), adjustedLD);
                gl.uniform3f(Kings.textureShader.getUniform('uDirectionalColor'), 1.0, 1.0, 1.0);

                Kings.GL.setMatrixUniforms(Kings.colorShader);
            }

            gl.drawArrays(gl.TRIANGLES, 0, this.triangleVertexPositionBuffer.numItems);

            Kings.GL.mvPopMatrix();
        }
    };
});
