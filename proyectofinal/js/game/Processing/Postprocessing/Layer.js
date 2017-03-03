define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.Layer = function(parameters) {
        this.name = parameters.name;
        this.effects = [];
        this.addEffect(new Kings.Shader({
            gl: gl,
            vertexShaderSource: [
                'attribute vec3 aVertexPosition;',
                'attribute vec2 aTextureCoord;',
                'uniform mat4 uMVMatrix;',
                'uniform mat4 uPMatrix;',
                'varying vec2 vTextureCoord;',
                'void main(void) {',
                   'gl_Position = uPMatrix * (uMVMatrix * vec4(aVertexPosition, 1.0));',
                   'vTextureCoord = aTextureCoord;',
                '}'
            ].join("\n"),
            fragmentShaderSource: [
                'precision mediump float;',
                'varying vec2 vTextureCoord;',
                'uniform sampler2D uSampler;',
                'void main(void) {',
                    'vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));',
                    'gl_FragColor = vec4(textureColor.rgb, textureColor.a);',
                '}'
            ].join("\n")
        }));
        this.draw = parameters.draw;
        this.width = gl.canvas.width;
        this.height = gl.canvas.height;
        this.initScreenBuffers();
    };

    Kings.Layer.prototype = {
        constructor: Kings.Layer,

        initScreenBuffers: function() {
            this.planeTextureCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.planeTextureCoordBuffer);
            var textureCoords = [
                0.0, 0.0,
                1.0, 0.0,
                0.0, 1.0,
                1.0, 1.0
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
            this.planeTextureCoordBuffer.itemSize = 2;
            this.planeTextureCoordBuffer.numItems = 4;

            this.planeVertexPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.planeVertexPositionBuffer);
            var vertices = [
                0 - (this.width / 2), 0 - (this.height / 2), 0,
                0 + (this.width / 2), 0 - (this.height / 2), 0,
                0 - (this.width / 2), 0 + (this.height / 2), 0,
                0 + (this.width / 2), 0 + (this.height / 2), 0
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            this.planeVertexPositionBuffer.itemSize = 3;
            this.planeVertexPositionBuffer.numItems = 4;
        },

        drawScreen: function(i, texture) {            
            this.vertexPositionAttribute = this.effects[i].getAttributeLocation('aVertexPosition');
            gl.enableVertexAttribArray(this.vertexPositionAttribute);
            this.textureCoordAttribute = this.effects[i].getAttributeLocation('aTextureCoord');
            gl.enableVertexAttribArray(this.textureCoordAttribute);

            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            glMatrix.mat4.perspective(Kings.pMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 200.0);

            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            Kings.GL.mvPushMatrix();
            Kings.GL.lookAt(
                glMatrix.vec3.fromValues(0,0,0),
                glMatrix.vec3.fromValues(0,0,-100),
                glMatrix.vec3.fromValues(0, 1, 0)
            );

            Kings.GL.mvTranslate({ x: 0, y: 0, z: -130 });

            gl.bindBuffer(gl.ARRAY_BUFFER, this.planeVertexPositionBuffer);
            gl.vertexAttribPointer(this.vertexPositionAttribute, this.planeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.useProgram(this.effects[i].getProgram());
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.uniform1i(this.effects[i].getProgram().samplerUniform, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.planeTextureCoordBuffer);
            gl.vertexAttribPointer(this.textureCoordAttribute, this.planeTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

            Kings.GL.setMatrixUniforms(this.effects[i]);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.planeVertexPositionBuffer.numItems);

            Kings.GL.mvPopMatrix();
        },

        addEffect: function(shader) {
            this.effects.push(shader);
            return this.effects.length - 1;
        },

        removeEffect: function(index) {
            this.effects.splice(index, 1);
        },
    };
});
