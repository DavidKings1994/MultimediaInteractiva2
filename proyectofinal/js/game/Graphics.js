define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    require('./Utils/MatrixOperations.js');
    require('./Geometry/Triangle.js');
    require('./Geometry/Plane.js');
    require('./GameObjects/Gameobject.js');
    require('./GameObjects/Camera.js');

    Kings.Graphics = function(parameters) {
        window.gl = parameters.canvas.getContext("webgl");
        if (!gl) {
            alert('No se puede incializar');
        }

        this.camera = parameters.camera || new Kings.Camera();
        this.gameUpdate = function() { parameters.update() };

        window.requestAnimFrame = (function() {
            return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback, element) {
                window.setTimeout(callback, 1000/60);
            };
        })();

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        Kings.mvMatrix = glMatrix.mat4.create();
        Kings.pMatrix = glMatrix.mat4.create();
        glMatrix.mat4.perspective(Kings.pMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
        Kings.mvMatrixStack = [];

        this.lastTime = 0;

        Kings.colorShader = new Kings.Shader({
            gl: gl,
            vertexShaderSource: '2d-vertex-shader',
            fragmentShaderSource: '2d-fragment-shader'
        });

        Kings.textureShader = new Kings.Shader({
            gl: gl,
            vertexShaderSource: '2d-vertex-shader-texture',
            fragmentShaderSource: '2d-fragment-shader-texture'
        });

        this.elements = [];
        this.tick();
    };

    Kings.Graphics.prototype = {
        constructor: Kings.Graphics,

        update: function() {
            for (var i = 0; i < this.elements.length; i++) {
                //if (Kings.Gameobject != null) {
                    //if(this.elements[i] instanceof Kings.Gameobject) {
                        this.elements[i].update();
                    //}
                //}
            }
            this.camera.update();
            this.gameUpdate();
        },

        draw: function() {
            this.resizeView();
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            for (var i = 0; i < this.elements.length; i++) {
                //if (Kings.Gameobject != null) {
                    //if(this.elements[i] instanceof Kings.Gameobject) {
                        this.elements[i].draw();
                    //}
                //}
            }
        },

        addElement: function(element) {
            if (element != null) {
                this.elements.push(element);
            }
        },

        animate: function() {
            var timeNow = new Date().getTime();
            if (this.lastTime != 0) {
                var elapsed = timeNow - this.lastTime;
                this.update();
            }
            this.lastTime = timeNow;
        },

        tick: function() {
            var self = this;
            requestAnimFrame(function() { self.tick() });
            this.animate();
            this.draw();
        },

        resizeView: function() {
            var displayWidth  = gl.canvas.clientWidth;
            var displayHeight = gl.canvas.clientHeight;
            if (gl.canvas.width  != displayWidth || gl.canvas.height != displayHeight) {
                gl.canvas.width  = displayWidth;
                gl.canvas.height = displayHeight;
            }
        }
    };
});
