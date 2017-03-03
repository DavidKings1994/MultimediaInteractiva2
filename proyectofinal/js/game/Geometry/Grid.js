define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    require('./../Utils/TextureLoader.js');

    Kings.Grid = function(parameters) {
        this.position = parameters.position || { x: 0, y: 0, z: 0 };
        this.rotation = parameters.rotation || { x: 0, y: 0, z: 0 };
        this.width = parameters.width || 1.0;
        this.height = parameters.height || 1.0;
        this.rows = parameters.rows || 10.0;
        this.cols = parameters.cols || 10.0;
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

    Kings.Grid.prototype = {
        constructor: Kings.Grid,

        initBuffers: function() {
            var stepx = this.width / this.cols;
            var stepy = this.height / this.rows;

            if (this.texture != null) {
                this.gridTextureCoordBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.gridTextureCoordBuffer);
                var textureCoords = [];
                for (var y = 0; y < this.rows; y++) {
                    for (var x = 0; x < this.cols; x++) {
                        textureCoords = textureCoords.concat([
                            0.0, 0.0,
                            1.0, 0.0,
                            0.0, 1.0,

                            1.0, 0.0,
                            1.0, 1.0,
                            0.0, 1.0,
                        ]);
                    }
                }
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
                this.gridTextureCoordBuffer.itemSize = 2;
                this.gridTextureCoordBuffer.numItems = 6 * (this.cols * this.rows);

                this.gridVertexPositionBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.gridVertexPositionBuffer);
                var vertices = [];
                for (var y = 0; y < this.rows; y++) {
                    for (var x = 0; x < this.cols; x++) {
                        vertices = vertices.concat([
                            (0 - (this.width / 2)) + ((x * stepx) + 0), (0 - (this.height / 2)) + ((y * stepy) + 0), 0,
                            (0 - (this.width / 2)) + ((x * stepx) + stepx), (0 - (this.height / 2)) + ((y * stepy) + 0), 0,
                            (0 - (this.width / 2)) + ((x * stepx) + 0), (0 - (this.height / 2)) + ((y * stepy) + stepy), 0,

                            (0 - (this.width / 2)) + ((x * stepx) + stepx), (0 - (this.height / 2)) + ((y * stepy) + 0), 0,
                            (0 - (this.width / 2)) + ((x * stepx) + stepx), (0 - (this.height / 2)) + ((y * stepy) + stepy), 0,
                            (0 - (this.width / 2)) + ((x * stepx) + 0), (0 - (this.height / 2)) + ((y * stepy) + stepy), 0,
                        ]);
                    }
                }
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
                this.gridVertexPositionBuffer.itemSize = 3;
                this.gridVertexPositionBuffer.numItems = 6 * (this.cols * this.rows);

                this.gridVertexNormalBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.gridVertexNormalBuffer);
                var vertexNormals = [];
                for (var y = 0; y < this.rows; y++) {
                    for (var x = 0; x < this.cols; x++) {
                        var offset = (((x * y) + x) * 6 * 3);
                        var normal1 = Kings.Processing.calculateNormal(
                            [vertices[offset], vertices[offset+1], vertices[offset+2]],
                            [vertices[offset+3], vertices[offset+4], vertices[offset+5]],
                            [vertices[offset+6], vertices[offset+7], vertices[offset+8]]
                        );
                        var normal2 = Kings.Processing.calculateNormal(
                            [vertices[offset+9], vertices[offset+10], vertices[offset+11]],
                            [vertices[offset+12], vertices[offset+13], vertices[offset+14]],
                            [vertices[offset+15], vertices[offset+16], vertices[offset+17]]
                        )
                        vertexNormals = vertexNormals.concat([
                            normal1[0], normal1[1], normal1[2],
                            normal1[0], normal1[1], normal1[2],
                            normal1[0], normal1[1], normal1[2],

                            normal2[0], normal2[1], normal2[2],
                            normal2[0], normal2[1], normal2[2],
                            normal2[0], normal2[1], normal2[2],
                        ]);
                    }
                }
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
                this.gridVertexNormalBuffer.itemSize = 3;
                this.gridVertexNormalBuffer.numItems = 6 * (this.cols * this.rows);

            } else {
                this.gridVertexColorBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.gridVertexColorBuffer);
                var colors = [];
                for (var y = 0; y < this.rows; y++) {
                    for (var x = 0; x < this.cols; x++) {
                        colors = textureCoords.concat([
                            this.color.r, this.color.g, this.color.b, this.color.a,
                            this.color.r, this.color.g, this.color.b, this.color.a,
                            this.color.r, this.color.g, this.color.b, this.color.a,
                            this.color.r, this.color.g, this.color.b, this.color.a,
                        ]);
                    }
                }
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
                this.gridVertexColorBuffer.itemSize = 4;
                this.gridVertexColorBuffer.numItems = 4 * (this.cols * this.rows);

                this.gridVertexPositionBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.gridVertexPositionBuffer);
                var vertices = [];
                for (var y = 0; y < this.rows; y++) {
                    for (var x = 0; x < this.cols; x++) {
                        vertices = vertices.concat([
                            (0 - (this.width / 2)) + ((x * stepx) + 0), (0 - (this.height / 2)) + ((y * stepy) + 0), 0,
                            (0 - (this.width / 2)) + ((x * stepx) + stepx), (0 - (this.height / 2)) + ((y * stepy) + 0), 0,
                            (0 - (this.width / 2)) + ((x * stepx) + 0), (0 - (this.height / 2)) + ((y * stepy) + stepy), 0,
                            (0 - (this.width / 2)) + ((x * stepx) + stepx), (0 - (this.height / 2)) + ((y * stepy) + stepy), 0
                        ]);
                    }
                }
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
                this.gridVertexPositionBuffer.itemSize = 3;
                this.gridVertexPositionBuffer.numItems = 4 * (this.cols * this.rows);

                this.gridVertexNormalBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.gridVertexNormalBuffer);
                var vertexNormals = [];
                for (var y = 0; y < this.rows; y++) {
                    for (var x = 0; x < this.cols; x++) {
                        vertexNormals = vertexNormals.concat([
                            0.0,  0.0,  1.0,
                            0.0,  0.0,  1.0,
                            0.0,  0.0,  1.0,
                            0.0,  0.0,  1.0
                        ]);
                    }
                }
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
                this.gridVertexNormalBuffer.itemSize = 3;
                this.gridVertexNormalBuffer.numItems = 4 * (this.cols * this.rows);
            }
        },

        update: function() {

        },

        draw: function() {
            Kings.GL.mvPushMatrix();
            Kings.GL.mvTranslate(this.position);
            Kings.GL.mvRotate(this.rotation.x, 1, 0, 0);
            Kings.GL.mvRotate(this.rotation.y, 0, 1, 0);
            Kings.GL.mvRotate(this.rotation.z, 0, 0, 1);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.gridVertexPositionBuffer);
            gl.vertexAttribPointer(this.vertexPositionAttribute, this.gridVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.gridVertexNormalBuffer);
            gl.vertexAttribPointer(this.vertexNormalAttribute, this.gridVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

            if (this.texture != null) {
                gl.useProgram(Kings.textureShader.getProgram());
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.uniform1i(Kings.textureShader.getProgram().samplerUniform, 0);

                Kings.GL.setLightUniforms(Kings.textureShader);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.gridTextureCoordBuffer);
                gl.vertexAttribPointer(this.textureCoordAttribute, this.gridTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

                Kings.GL.setMatrixUniforms(Kings.textureShader);
            } else {
                gl.useProgram(Kings.colorShader.getProgram());
                gl.bindBuffer(gl.ARRAY_BUFFER, this.gridVertexColorBuffer);
                gl.vertexAttribPointer(this.vertexColorAttribute, this.gridVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

                Kings.GL.setLightUniforms(Kings.colorShader);
                Kings.GL.setMatrixUniforms(Kings.colorShader);
            }
            gl.drawArrays(gl.TRIANGLES, 0, this.gridVertexPositionBuffer.numItems);

            Kings.GL.mvPopMatrix();
        }
    };
});
