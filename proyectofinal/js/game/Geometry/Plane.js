define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    require('./../Utils/TextureLoader.js');

    Kings.Plane = function(parameters) {
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

    Kings.Plane.prototype = {
        constructor: Kings.Plane,

        initBuffers: function() {
            if (this.texture != null) {
                this.planeTextureCoordBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.planeTextureCoordBuffer);
                var textureCoords = [
                    0.0, 0.0,
                    1.0, 0.0,
                    0.0, 1.0,
                    1.0, 1.0,
                ];
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
                this.planeTextureCoordBuffer.itemSize = 2;
                this.planeTextureCoordBuffer.numItems = 4;

            } else {
                this.planeVertexColorBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.planeVertexColorBuffer);
                var colors = [
                    this.color.r, this.color.g, this.color.b, this.color.a,
                    this.color.r, this.color.g, this.color.b, this.color.a,
                    this.color.r, this.color.g, this.color.b, this.color.a,
                    this.color.r, this.color.g, this.color.b, this.color.a,
                ];
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
                this.planeVertexColorBuffer.itemSize = 4;
                this.planeVertexColorBuffer.numItems = 4;
            }

            this.planeVertexPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.planeVertexPositionBuffer);
            var vertices = [
                this.position.x - (this.width / 2), this.position.y - (this.height / 2), this.position.z,
                this.position.x + (this.width / 2), this.position.y - (this.height / 2), this.position.z,
                this.position.x - (this.width / 2), this.position.y + (this.height / 2), this.position.z,
                this.position.x + (this.width / 2), this.position.y + (this.height / 2), this.position.z,
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            this.planeVertexPositionBuffer.itemSize = 3;
            this.planeVertexPositionBuffer.numItems = 4;

            this.planeVertexNormalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.planeVertexNormalBuffer);
            var vertexNormals = [
                0.0,  0.0,  -1.0,
                0.0,  0.0,  -1.0,
                0.0,  0.0,  -1.0,
                0.0,  0.0,  -1.0,
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
            this.planeVertexNormalBuffer.itemSize = 3;
            this.planeVertexNormalBuffer.numItems = 4;
        },

        update: function() {

        },

        draw: function() {
            Kings.GL.mvPushMatrix();
            Kings.GL.mvTranslate(this.position);
            Kings.GL.mvRotate(this.rotation.x, 1, 0, 0);
            Kings.GL.mvRotate(this.rotation.y, 0, 1, 0);
            Kings.GL.mvRotate(this.rotation.z, 0, 0, 1);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.planeVertexPositionBuffer);
            gl.vertexAttribPointer(this.vertexPositionAttribute, this.planeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.planeVertexNormalBuffer);
            gl.vertexAttribPointer(this.vertexNormalAttribute, this.planeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

            if (this.texture != null) {
                gl.useProgram(Kings.textureShader.getProgram());
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.uniform1i(Kings.textureShader.getProgram().samplerUniform, 0);

                gl.uniform3f(Kings.textureShader.getUniform('uAmbientColor'), 1.0, 1.0, 1.0);
                var lightingDirection = [0.0, -1.0, -1.0];
                var adjustedLD = glMatrix.vec3.create();
                glMatrix.vec3.normalize(adjustedLD, lightingDirection);
                gl.uniform3fv(Kings.textureShader.getUniform('uLightingDirection'), adjustedLD);
                gl.uniform3f(Kings.textureShader.getUniform('uDirectionalColor'), 1.0, 1.0, 1.0);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.planeTextureCoordBuffer);
                gl.vertexAttribPointer(this.textureCoordAttribute, this.planeTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

                Kings.GL.setMatrixUniforms(Kings.textureShader);
            } else {
                gl.useProgram(Kings.colorShader.getProgram());
                gl.bindBuffer(gl.ARRAY_BUFFER, this.planeVertexColorBuffer);
                gl.vertexAttribPointer(this.vertexColorAttribute, this.planeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

                gl.uniform3f(Kings.textureShader.getUniform('uAmbientColor'), 1.0, 1.0, 1.0);
                var lightingDirection = [0.0, -1.0, -1.0];
                var adjustedLD = glMatrix.vec3.create();
                glMatrix.vec3.normalize(adjustedLD, lightingDirection);
                gl.uniform3fv(Kings.textureShader.getUniform('uLightingDirection'), adjustedLD);
                gl.uniform3f(Kings.textureShader.getUniform('uDirectionalColor'), 1.0, 1.0, 1.0);

                Kings.GL.setMatrixUniforms(Kings.colorShader);
            }

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.planeVertexPositionBuffer.numItems);

            Kings.GL.mvPopMatrix();
        }
    };
});
