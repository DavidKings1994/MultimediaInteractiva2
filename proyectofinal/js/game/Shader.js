define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.Shader = function(parameters) {
        this.gl = parameters.gl;
        var vertexShaderSource = document.getElementById(parameters.vertexShaderSource).text;
        var fragmentShaderSource = document.getElementById(parameters.fragmentShaderSource).text;

        this.vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        this.fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
        this.program = this.createProgram();
    };

    Kings.Shader.prototype = {
        constructor: Kings.Shader,

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

        getUniform: function(name) {
            return this.gl.getUniformLocation(this.program, name);
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
});
