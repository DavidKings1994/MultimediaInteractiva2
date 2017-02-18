define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.Player = function(parameters) {
        var self = this;
        Kings.GameObject.call(this, parameters);
        this.live = true;
        this.velocity = parameters.velocity || 0;
        this.camera = parameters.camera;
        this.turningSpeed = 5;
        for (var i = 0; i < this.shape.groups.length; i++) {
            if(this.shape.groups[i].name == 'backWheel_HarleyDavidson.007') {
                (function() {
                    var index = (i + 0);
                    self.shape.groups[i].offset = { x: 0, y: 0.6363, z: 0.0171 };
                    self.addUpdateFunction(function(){
                        self.shape.groups[index].rotation.x += 10 * self.velocity;
                    });
                }());
            }
            if(this.shape.groups[i].name == 'frontWheel_HarleyDavidson.006') {
                (function() {
                    var index = (i + 0);
                    self.shape.groups[i].offset = { x: 0, y: 0.64168, z: 3.23467 };
                    self.addUpdateFunction(function(){
                        self.shape.groups[index].rotation.x += 10 * self.velocity;
                    });
                }());
            }
        }
        self.trashFunction = -1;
    };

    Kings.Player.prototype = Object.create(Kings.GameObject.prototype);

    Kings.Player.prototype.update = function() {
        Kings.GameObject.prototype.update.call(this);
        this.shape.update();
        if (this.live) {
            this.position.z += this.velocity;
        }
        this.camera.position.z = this.position.z - 5;
        var moving = false;
        if (Kings.keyboard.isDown(Kings.keyboard.keys.UP) || Kings.keyboard.isDown(Kings.keyboard.keys.W)) {
            if (Kings.keyboard.current == Kings.keyboard.keys.UP || Kings.keyboard.current == Kings.keyboard.keys.W) {
                this.speedUp();
                this.explode();
            }
        }
        if (Kings.keyboard.isDown(Kings.keyboard.keys.LEFT) || Kings.keyboard.isDown(Kings.keyboard.keys.A)) {
            if (Kings.keyboard.current == Kings.keyboard.keys.LEFT || Kings.keyboard.current == Kings.keyboard.keys.A) {
                moving = true;
                if (this.rotation.z > -20) {
                    this.rotation.z -= this.turningSpeed * Kings.Processing.map(Math.abs(this.rotation.z), 0, 20, 1, 2);
                }
                this.moveLeft();
            }
        }
        if (Kings.keyboard.isDown(Kings.keyboard.keys.DOWN) || Kings.keyboard.isDown(Kings.keyboard.keys.S)) {
            if (Kings.keyboard.current == Kings.keyboard.keys.DOWN || Kings.keyboard.current == Kings.keyboard.keys.S) {
                this.slowDown();
                moving = true;
                if (this.rotation.x > -45) {
                    this.rotation.x -= this.turningSpeed * Kings.Processing.map(Math.abs(this.rotation.x), 0, 20, 1, 2);
                }
                this.restart();
            }
        }
        if (Kings.keyboard.isDown(Kings.keyboard.keys.RIGHT) || Kings.keyboard.isDown(Kings.keyboard.keys.D)) {
            if (Kings.keyboard.current == Kings.keyboard.keys.RIGHT || Kings.keyboard.current == Kings.keyboard.keys.D) {
                moving = true;
                if (this.rotation.z < 20) {
                    this.rotation.z += this.turningSpeed * Kings.Processing.map(Math.abs(this.rotation.z), 0, 20, 1, 2);
                }
                this.moveRight();
            }
        }
        if (!moving) {
            if (this.rotation.x < 0) {
                this.rotation.x += this.turningSpeed * Kings.Processing.map(Math.abs(this.rotation.x), 0, 20, 1, 2);
            }
            if (this.rotation.z > 0) {
                this.rotation.z -= this.turningSpeed * Kings.Processing.map(Math.abs(this.rotation.z), 0, 20, 1, 2);
            } else if (this.rotation.z < 0) {
                this.rotation.z += this.turningSpeed * Kings.Processing.map(Math.abs(this.rotation.z), 0, 20, 1, 2);
            }
            if (this.rotation.z < 3 && this.rotation.z > -3) {
                this.rotation.z = 0;
            }
        }
    };

    Kings.Player.prototype.explode = function() {
        var self = this;
        if (this.live) {
            this.directions = [];
            for (var i = 0; i <= this.shape.groups.length; i++) {
                var dx = Math.random() < 0.5 ? 1 : -1;
                var dz = Math.random() < 0.5 ? 1 : -1;
                this.directions.push({ x: Math.random() * dx, y: 0.5, z: Math.random() * dz });
            }
            (function() {
                self.trashFunction = self.addUpdateFunction(function(){
                    if (self.position.y >= -2) {
                        self.position.y += self.directions[self.directions.length - 1].y - 0.05;
                    }
                    self.directions[self.directions.length - 1].y -= Math.abs(self.position.y) * 0.05;
                    for (var i = 0; i < self.shape.groups.length; i++) {
                        self.shape.groups[i].position.x += self.directions[i].x;
                        //self.shape.groups[i].position.y += self.directions[i].y * Math.random();
                        self.shape.groups[i].position.z += self.directions[i].z;
                        self.directions[i].y -= self.directions[i].y * 0.05;
                    }
                });
            }());
            this.live = false;
        }
    };

    Kings.Player.prototype.restart = function() {
        if (!this.live) {
            if (this.trashFunction != -1) {
                this.removeUpdateFunction(this.trashFunction);
                this.position.x = 0;
                this.position.y = -2;
                this.position.z = 0;
                for (var i = 0; i < this.shape.groups.length; i++) {
                    this.directions = [];
                    this.shape.groups[i].position.x = 0;
                    this.shape.groups[i].position.y = 0;
                    this.shape.groups[i].position.z = 0;
                }
            }
            this.live = true;
        }
    };

    Kings.Player.prototype.moveLeft = function() {
        this.position.x += 0.1;
    };

    Kings.Player.prototype.moveRight = function() {
        this.position.x -= 0.1;
    };

    Kings.Player.prototype.slowDown = function() {
        if (this.velocity > 0.5) {
            this.velocity -= 0.05;
        }
    };

    Kings.Player.prototype.speedUp = function() {
        if (this.velocity < 1.0) {
            this.velocity += 0.05;
        }
    };
});
