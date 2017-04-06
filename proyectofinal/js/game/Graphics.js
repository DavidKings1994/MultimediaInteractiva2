define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    require('./Utils/MatrixOperations.js');
    require('./Matemathic/Vector.js');
    require('./Geometry/Triangle.js');
    require('./Geometry/Plane.js');
    require('./Geometry/Cube.js');
    require('./Geometry/Grid.js');
    require('./GameObjects/Gameobject.js');
    require('./GameObjects/Camera.js');
    require('./Processing/Utils.js');
    require('./Processing/Postprocessing/Renderer.js');
    require('./Processing/Postprocessing/Layer.js');
    require('./Particles/ParticleExplosion.js');
    require('./Particles/ParticleFire.js');

    Kings.Graphics = function(parameters) {
        var self = this;
        Kings.canvas = parameters.canvas;
        window.gl = parameters.canvas.getContext("webgl");
        if (!gl) {
            alert('No se puede incializar');
        }

        Kings.height = parameters.canvas.clientHeight;
        Kings.width = parameters.canvas.clientWidth;
        this.ready = false;
        this.paused = false;

        this.mainLayer = new Kings.Layer({
            name: 'main',
            draw: function() {
                self.draw();
            }
        });
        this.renderer = new Kings.Renderer();
        this.renderer.addLayer(this.mainLayer);

        this.light = parameters.light;
        this.camera = parameters.camera || new Kings.Camera();
        this.gameUpdate = function() { parameters.update() };

        this.lastTime = 0;
        this.elapsedTime = 0;
        this.timeStep = 1000/60;

        window.requestAnimFrame = (function() {
            return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback, element) {
                window.setTimeout(callback, this.timeStep);
            };
        })();

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        Kings.mvMatrix = glMatrix.mat4.create();
        Kings.pMatrix = glMatrix.mat4.create();
        Kings.wMatrix = glMatrix.mat4.create();
        Kings.vMatrix = glMatrix.mat4.create();
        glMatrix.mat4.perspective(Kings.pMatrix, 45, gl.canvas.width / gl.canvas.height, 0.01, 100.0);
        Kings.mvMatrixStack = [];

        Kings.colorShader = new Kings.Shader({
            gl: gl,
            vertexShaderSource: document.getElementById('2d-vertex-shader').text,
            fragmentShaderSource: document.getElementById('2d-fragment-shader').text
        });

        Kings.textureShader = new Kings.Shader({
            gl: gl,
            vertexShaderSource: document.getElementById('2d-vertex-shader-texture').text,
            fragmentShaderSource: document.getElementById('2d-fragment-shader-texture').text
        });

        this.elements = [];
        this.tick();
    };

    Kings.Graphics.prototype = {
        constructor: Kings.Graphics,

        update: function() {
            if (!this.paused) {
                for (var i = 0; i < this.elements.length; i++) {
                    //if (Kings.Gameobject != null) {
                        //if(this.elements[i] instanceof Kings.Gameobject) {
                            this.elements[i].update();
                        //}
                    //}
                }
                this.camera.update();
            }
            this.gameUpdate();
        },

        draw: function() {
            if (this.ready) {
                this.resizeView();
                gl.clearColor(0.0, 0.0, 0.0, 1);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

                glMatrix.mat4.perspective(Kings.pMatrix, 45, gl.canvas.width / gl.canvas.height, 0.01, 100.0);

                for (var i = 0; i < this.elements.length; i++) {
                    //if (Kings.Gameobject != null) {
                        //if(this.elements[i] instanceof Kings.Gameobject) {
                            this.elements[i].draw();
                        //}
                    //}
                }
            }
        },

        addElement: function(element) {
            if (element != null) {
                this.elements.push(element);
            }
        },

        animate: function() {
            var timeNow = new Date().getTime();
            if (timeNow > this.lastTime + this.timeStep) {
                this.update();
                this.elapsed = timeNow - this.lastTime;
                this.lastTime = timeNow;
            }
        },

        tick: function() {
            var self = this;
            requestAnimFrame(function() { self.tick() });
            this.animate();
            this.renderer.render();
        },

        resizeView: function() {
            var displayWidth  = gl.canvas.clientWidth;
            var displayHeight = gl.canvas.clientHeight;
            if (gl.canvas.width  != displayWidth || gl.canvas.height != displayHeight) {
                gl.canvas.width  = displayWidth;
                gl.canvas.height = displayHeight;
                Kings.width = displayWidth;
                Kings.height = displayHeight;
                this.renderer.resize();
            }
        },

        pause: function() {
            this.paused = !this.paused;
        }
    };
});
