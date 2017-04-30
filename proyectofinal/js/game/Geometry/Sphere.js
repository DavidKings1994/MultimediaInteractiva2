define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    require('./../Utils/TextureLoader.js');

    Kings.Sphere = function(parameters) {
        this.position = parameters.position || { x: 0, y: 0, z: 0 };
        this.rotation = parameters.rotation || { x: 0, y: 0, z: 0 };
        this.radius = parameters.radius || 1;
        this.slices = parameters.slices || 6;
        this.stacks = parameters.stacks || 6;
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

    Kings.Sphere.prototype = {
        constructor: Kings.Sphere,

        initBuffers: function() {
            var textureCoords = [];
            var vertices = [];
            var vertexNormals = [];
            var colors = [];
            var indexData = [];

            if (this.texture != null) {
                var xStep = Math.PI / this.slices;
                var yStep = Math.PI / this.stacks;
                for (var stack = 0; stack <= this.stacks; stack++) {
                    var theta = stack * yStep;
                    var sinTheta = Math.sin(theta);
                    var cosTheta = Math.cos(theta);
                    for (var slice = 0; slice <= this.slices; slice++) {
                        var phi = slice * 2 * xStep;
                        var sinPhi = Math.sin(phi);
                        var cosPhi = Math.cos(phi);

                        var x = cosPhi * sinTheta;
                        var y = cosTheta;
                        var z = sinPhi * sinTheta;
                        var u = 1 - (slice / this.stacks);
                        var v = 1 - (stack / this.slices);

                        vertexNormals.push(x);
                        vertexNormals.push(y);
                        vertexNormals.push(z);
                        textureCoords.push(u);
                        textureCoords.push(v);
                        vertices.push(this.position.x + (this.radius * x));
                        vertices.push(this.position.y + (this.radius * y));
                        vertices.push(this.position.z + (this.radius * z));
                    }
                }

                this.sphereTextureCoordBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.sphereTextureCoordBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
                this.sphereTextureCoordBuffer.itemSize = 2;
                this.sphereTextureCoordBuffer.numItems = textureCoords.length / 2;

            } else {
                var xStep = Math.PI / this.slices;
                var yStep = Math.PI / this.stacks;
                for (var stack = 0; stack <= this.stacks; stack++) {
                    var theta = latNumber * yStep;
                    var sinTheta = Math.sin(theta);
                    var cosTheta = Math.cos(theta);
                    for (var slice = 0; slice <= this.slices; slice++) {
                        var phi = longNumber * 2 * xStep;
                        var sinPhi = Math.sin(phi);
                        var cosPhi = Math.cos(phi);

                        var x = cosPhi * sinTheta;
                        var y = cosTheta;
                        var z = sinPhi * sinTheta;
                        var u = 1 - (longNumber / longitudeBands);
                        var v = 1 - (latNumber / latitudeBands);

                        colors.push(this.color.r);
                        colors.push(this.color.g);
                        colors.push(this.color.b);
                        colors.push(this.color.a);
                        vertexNormals.push(x);
                        vertexNormals.push(y);
                        vertexNormals.push(z);
                        vertices.push(this.position.x + (this.radius * x));
                        vertices.push(this.position.y + (this.radius * y));
                        vertices.push(this.position.z + (this.radius * z));
                    }
                }

                this.sphereVertexColorBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.sphereVertexColorBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
                this.sphereVertexColorBuffer.itemSize = 4;
                this.sphereVertexColorBuffer.numItems = colors.length / 4;
            }

            for (var stack = 0; stack < this.stacks; stack++) {
                for (var slice = 0; slice < this.slices; slice++) {
                    var first = (stack * (this.slices + 1)) + slice;
                    var second = first + this.slices + 1;
                    indexData.push(first);
                    indexData.push(second);
                    indexData.push(first + 1);

                    indexData.push(second);
                    indexData.push(second + 1);
                    indexData.push(first + 1);
                }
            }

            this.sphereVertexPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.sphereVertexPositionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            this.sphereVertexPositionBuffer.itemSize = 3;
            this.sphereVertexPositionBuffer.numItems = vertices.length / 3;

            this.sphereVertexNormalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.sphereVertexNormalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
            this.sphereVertexNormalBuffer.itemSize = 3;
            this.sphereVertexNormalBuffer.numItems = vertexNormals.length / 3;

            this.sphereVertexIndexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.sphereVertexIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
            this.sphereVertexIndexBuffer.itemSize = 1;
            this.sphereVertexIndexBuffer.numItems = indexData.length;
        },

        update: function() {

        },

        draw: function(shader) {
            Kings.GL.mvPushMatrix();
            Kings.GL.mvTranslate(this.position);
            Kings.GL.mvRotate(this.rotation.x, 1, 0, 0);
            Kings.GL.mvRotate(this.rotation.y, 0, 1, 0);
            Kings.GL.mvRotate(this.rotation.z, 0, 0, 1);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.sphereVertexPositionBuffer);
            gl.vertexAttribPointer(this.vertexPositionAttribute, this.sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.sphereVertexNormalBuffer);
            gl.vertexAttribPointer(this.vertexNormalAttribute, this.sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

            if (shader != undefined) {
                gl.useProgram(shader.getProgram());
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.uniform1i(shader.getProgram().samplerUniform, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.sphereTextureCoordBuffer);
                gl.vertexAttribPointer(this.textureCoordAttribute, this.sphereTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

                Kings.GL.setMatrixUniforms(shader);
            } else {
                if (this.texture != null) {
                    gl.useProgram(Kings.textureShader.getProgram());
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, this.texture);
                    gl.uniform1i(Kings.textureShader.getProgram().samplerUniform, 0);

                    Kings.GL.setLightUniforms(Kings.textureShader);

                    gl.bindBuffer(gl.ARRAY_BUFFER, this.sphereTextureCoordBuffer);
                    gl.vertexAttribPointer(this.textureCoordAttribute, this.sphereTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

                    Kings.GL.setMatrixUniforms(Kings.textureShader);
                } else {
                    gl.useProgram(Kings.colorShader.getProgram());
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.sphereVertexColorBuffer);
                    gl.vertexAttribPointer(this.vertexColorAttribute, this.sphereVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

                    Kings.GL.setLightUniforms(Kings.colorShader);
                    Kings.GL.setMatrixUniforms(Kings.colorShader);
                }
            }

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.sphereVertexIndexBuffer);
            gl.drawElements(gl.TRIANGLES, this.sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

            Kings.GL.mvPopMatrix();
        }
    };
});
