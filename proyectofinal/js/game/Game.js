(function(root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'glMatrix'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery', 'glMatrix'));
    } else {
        root.myModule = factory(root.jquery, root.glMatrix);
    }
}(this, function($, glMatrix) {
    'use strict';

    var KingsGame = window.KingsGame || {};
    var KingsGame = ( function() {
        function KingsGame() {
            var self = this, dataSettings;
            self.init(true);
        }
        return KingsGame;
    }());

    KingsGame.Shader = function(parameters) {
        this.gl = parameters.gl;
        var vertexShaderSource = document.getElementById(parameters.vertexShaderSource).text;
        var fragmentShaderSource = document.getElementById(parameters.fragmentShaderSource).text;

        this.vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        this.fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
        this.program = this.createProgram();
    };

    KingsGame.Shader.prototype = {
        constructor: KingsGame.Shader,

        createShader: function(type, source) {
            var shader = this.gl.createShader(type);
            this.gl.shaderSource(shader, source);
            this.gl.compileShader(shader);
            var success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
            if (success) {
                return shader;
            }

            console.log(this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
        },

        createProgram: function() {
            var program = this.gl.createProgram();
            this.gl.attachShader(program, this.vertexShader);
            this.gl.attachShader(program, this.fragmentShader);
            this.gl.linkProgram(program);
            var success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
            if (success) {
                return program;
            }

            console.log(this.gl.getProgramInfoLog(program));
            this.gl.deleteProgram(program);
        },

        getProgram: function() {
            return this.program;
        },

        getAttributeLocation: function(name) {
            return this.gl.getAttribLocation(this.program, name);
        },

        setAtribute: function(value, type) {
            var buffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            switch (type) {
                case 'Float32Array': {
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(value), this.gl.STATIC_DRAW);
                    return buffer;
                }
                default: {}
            }
        }
    };

    KingsGame.Graphics = function(canvas) {
        this.gl = canvas.getContext("webgl");
        if (!this.gl) {
            alert('No se puede incializar');
        }

        this.shader = new KingsGame.Shader({
            gl: this.gl,
            vertexShaderSource: '2d-vertex-shader',
            fragmentShaderSource: '2d-fragment-shader'
        });
        var positions = [
            0, 0,
            0, 0.5,
            0.7, 0,
        ];
        this.positionAttributeLocation = this.shader.getAttributeLocation('a_position');
        this.positionBuffer = this.shader.setAtribute(positions, 'Float32Array');

        this.draw();
    };

    KingsGame.Graphics.prototype = {
        constructor: KingsGame.Graphics,

        update: function() {

        },

        draw: function() {
            this.resizeView();
            this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
            this.gl.clearColor(0, 0, 0, 0);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            this.gl.useProgram(this.shader.getProgram());
            this.gl.enableVertexAttribArray(this.positionAttributeLocation);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

            var size = 2;
            var type = this.gl.FLOAT;
            var normalize = false;
            var stride = 0;
            var offset = 0;
            this.gl.vertexAttribPointer(this.positionAttributeLocation, size, type, normalize, stride, offset);

            var primitiveType = this.gl.TRIANGLES;
            var offset = 0;
            var count = 3;
            this.gl.drawArrays(primitiveType, offset, count);
        },

        resizeView: function() {
            var displayWidth  = this.gl.canvas.clientWidth;
            var displayHeight = this.gl.canvas.clientHeight;
            if (this.gl.canvas.width  != displayWidth || this.gl.canvas.height != displayHeight) {
                this.gl.canvas.width  = displayWidth;
                this.gl.canvas.height = displayHeight;
            }
        }
    };

    $.fn.KingsGame = function( parameters ) {
        KingsGame.game = new KingsGame.Graphics($(this)[0]);
    };
}));
