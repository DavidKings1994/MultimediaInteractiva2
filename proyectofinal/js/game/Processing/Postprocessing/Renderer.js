define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.Renderer = function(parameters) {
        this.effects = [];
        this.texture = [null, null];
        this.frameBuffer = [null, null];
        this.renderBuffer = [null, null];
        this.currentBuffer = 0;
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
        this.initBuffers(0);
        this.initBuffers(1);
        this.initScreenBuffers();
    };

    Kings.Renderer.prototype = {
        constructor: Kings.Renderer,

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

        initBuffers: function(i) {
            this.frameBuffer[i] = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer[i]);

            this.frameBuffer[i].width = 1343;
            this.frameBuffer[i].height = 672;

            this.texture[i] = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.texture[i]);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer[i].width, this.frameBuffer[i].height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

            this.renderBuffer[i] = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer[i]);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.frameBuffer[i].width, this.frameBuffer[i].height);

            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture[i], 0);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderBuffer[i]);

            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        },

        swapBuffers: function() {
            this.currentBuffer = this.currentBuffer == 0 ? 1 : 0;
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        },

        drawScreen: function(i) {
            this.vertexPositionAttribute = this.effects[i].getAttributeLocation('aVertexPosition');
            gl.enableVertexAttribArray(this.vertexPositionAttribute);
            this.textureCoordAttribute = this.effects[i].getAttributeLocation('aTextureCoord');
            gl.enableVertexAttribArray(this.textureCoordAttribute);

            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            glMatrix.mat4.perspective(Kings.pMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 200.0);

            Kings.GL.lookAt(
                glMatrix.vec3.fromValues(0,0,0),
                glMatrix.vec3.fromValues(0,0,-100),
                glMatrix.vec3.fromValues(0, 1, 0)
            );

            Kings.GL.mvPushMatrix();
            Kings.GL.mvTranslate({ x: 0, y: 0, z: -130 });

            gl.bindBuffer(gl.ARRAY_BUFFER, this.planeVertexPositionBuffer);
            gl.vertexAttribPointer(this.vertexPositionAttribute, this.planeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.useProgram(this.effects[i].getProgram());
            gl.activeTexture(gl.TEXTURE0);
            var tindex = (this.currentBuffer == 0 ? 1 : 0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture[tindex]);
            gl.uniform1i(this.effects[i].getProgram().samplerUniform, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.planeTextureCoordBuffer);
            gl.vertexAttribPointer(this.textureCoordAttribute, this.planeTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

            Kings.GL.setMatrixUniforms(this.effects[i]);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.planeVertexPositionBuffer.numItems);

            Kings.GL.mvPopMatrix();
        },

        render: function() {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer[this.currentBuffer]);
            this.draw();
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this.swapBuffers();

            for (var i = 0; i < this.effects.length; i++) {
                if (i < this.effects.length - 1) {
                    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer[this.currentBuffer]);
                }
                this.drawScreen(i);
                this.swapBuffers();
            }
        },

        addEffect: function(shader) {
            this.effects.push(shader);
            return this.effects.length - 1;
        },

        removeEffect: function(index) {
            this.effects.splice(index, 1);
        }
    };
});
