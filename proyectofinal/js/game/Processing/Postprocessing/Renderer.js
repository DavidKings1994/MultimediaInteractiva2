define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.Renderer = function(parameters) {
        this.layers = [];
        this.texture = [null, null];
        this.frameBuffer = [null, null];
        this.renderBuffer = [null, null];
        this.currentBuffer = 0;
        this.initBuffers(0);
        this.initBuffers(1);
    };

    Kings.Renderer.prototype = {
        constructor: Kings.Renderer,

        initBuffers: function(i) {
            this.frameBuffer[i] = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer[i]);

            this.frameBuffer[i].width = Kings.width;
            this.frameBuffer[i].height = Kings.height;

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

        render: function() {
            for (var i = 0; i < this.layers.length; i++) {
                if (i != 0) {
                    this.swapBuffers();
                }
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer[this.currentBuffer]);
                this.layers[i].draw();
                this.swapBuffers();
                for (var j = 0; j < this.layers[i].effects.length; j++) {
                    if (i < this.layers.length - 1) {
                        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer[this.currentBuffer]);
                    } else if (j < this.layers[i].effects.length - 1) {
                        gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer[this.currentBuffer]);
                    } else {
                        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                    }
                    var tindex = (this.currentBuffer == 0 ? 1 : 0);
                    this.layers[i].drawScreen(j, this.texture[tindex]);
                    this.swapBuffers();
                }
            }
        },

        addLayer: function(layer) {
            this.layers.push(layer);
            return this.layers.length - 1;
        },

        removeLayer: function(index) {
            this.layers.splice(index, 1);
        },

        resize: function() {
            this.initBuffers(0);
            this.initBuffers(1);
        }
    };
});
