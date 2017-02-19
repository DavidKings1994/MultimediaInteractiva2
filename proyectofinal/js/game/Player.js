define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.Player = function(parameters) {
        var self = this;
        Kings.GameObject.call(this, parameters);
        this.live = true;
        this.motorSound = parameters.motorSound;
        this.motorAccelSound = parameters.motorAccelSound;
        this.velocity = (parameters.velocity + 0) || 0;
        this.baseVelocity = (parameters.velocity + 0) || 0;
        this.camera = parameters.camera;
        this.turningSpeed = 5;
        this.jumping = false;
        this.onFloor = true;
        this.jumpHeightFix = 2;
        this.DPress = 0;
        this.APress = 0;
        for (var i = 0; i < this.shape.groups.length; i++) {
            if(this.shape.groups[i].name == 'backWheel_HarleyDavidson.007') {
                (function() {
                    var index = (i + 0);
                    self.shape.groups[i].offset = { x: 0, y: 0.6363, z: 0.0171 };
                    self.addUpdateFunction(function(){
                        self.shape.groups[index].rotation.x += 25 * self.velocity;
                    });
                }());
            }
            if(this.shape.groups[i].name == 'frontWheel_HarleyDavidson.006') {
                (function() {
                    var index = (i + 0);
                    self.shape.groups[i].offset = { x: 0, y: 0.64168, z: 3.23467 };
                    self.addUpdateFunction(function(){
                        self.shape.groups[index].rotation.x += 25 * self.velocity;
                    });
                }());
            }
        }
        self.trashFunction = -1;
        this.motorSound.loop = true;
        this.motorSound.addEventListener('timeupdate', function() {
            if(self.motorSound.currentTime > 10) {
                self.motorSound.currentTime = 2;
            }
        });
        this.motorSound.play();
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
        var backflip = false;
        if (Kings.keyboard.isDown(Kings.keyboard.keys.R)) {
            this.restart();
        }
        if (Kings.keyboard.isDown(Kings.keyboard.keys.E)) {
            this.explode();
        }
        if (Kings.keyboard.isDown(Kings.keyboard.keys.W)) {
            if (!Kings.keyboard.isDown(Kings.keyboard.keys.S)) {
                this.speedUp();
            }
        }
        if (Kings.keyboard.isDown(Kings.keyboard.keys.S)) {
            if (!Kings.keyboard.isDown(Kings.keyboard.keys.W)) {
                this.slowDown();
                backflip = true;
                if (this.rotation.x > -45) {
                    this.rotation.x -= this.turningSpeed * Kings.Processing.map(Math.abs(this.rotation.x), 0, 45, 1, 2);
                }
            }
        }
        var direction = Kings.keyboard.firstKeyPressed(Kings.keyboard.keys.A, Kings.keyboard.keys.D);
        if (direction != null) {
            if (direction == Kings.keyboard.keys.A) {
                moving = true;
                if (this.rotation.z > -20) {
                    this.rotation.z -= this.turningSpeed * Kings.Processing.map(Math.abs(this.rotation.z), 0, 20, 1, 2);
                }
                this.moveA();
            } else if (direction == Kings.keyboard.keys.D) {
                moving = true;
                if (this.rotation.z < 20) {
                    this.rotation.z += this.turningSpeed * Kings.Processing.map(Math.abs(this.rotation.z), 0, 20, 1, 2);
                }
                this.moveD();
            }
        }
        if (Kings.keyboard.isDown(Kings.keyboard.keys.SPACE)) {
            if (Kings.keyboard.getLastKeyPressed() == Kings.keyboard.keys.SPACE) {
                if (!this.jumping && this.onFloor) {
                    this.jumping = true;
                    this.onFloor = false;
                }
            }
        }

        if (this.live) {
            if (this.jumping) {
                if (this.position.y < -0.5) {
                    this.position.y += Math.abs(this.position.y) * 0.1;
                } else {
                    this.jumping = false;
                }
            } else if (this.position.y > -2 + Kings.Processing.map(Math.abs(this.rotation.x), 0, 45, 0, 0.2) && !this.jumping && !this.onFloor) {
                this.position.y -= Math.abs(this.position.y) * 0.1;
            } else {
                this.position.y = (-2 + Kings.Processing.map(Math.abs(this.rotation.x), 0, 45, 0, 0.2));
                this.onFloor = true;
            }
        }

        if(!backflip) {
            if (this.rotation.x < 0) {
                this.rotation.x += this.turningSpeed * Kings.Processing.map(Math.abs(this.rotation.x), 0, 20, 1, 2);
            }
        }

        if (!moving) {
            if (this.rotation.z > 0) {
                this.rotation.z -= this.turningSpeed * Kings.Processing.map(Math.abs(this.rotation.z), 0, 20, 1, 2);
            } else if (this.rotation.z < 0) {
                this.rotation.z += this.turningSpeed * Kings.Processing.map(Math.abs(this.rotation.z), 0, 20, 1, 2);
            }
            if (this.rotation.z < 3 && this.rotation.z > -3) {
                this.rotation.z = 0;
            }
        }

        if (!Kings.keyboard.isDown(Kings.keyboard.keys.S) && !Kings.keyboard.isDown(Kings.keyboard.keys.W)) {
            if (this.velocity > this.baseVelocity) {
                this.velocity -= 0.05;
            } else if (this.velocity < this.baseVelocity) {
                this.velocity += 0.05;
            }
        }
    };

    Kings.Player.prototype.explode = function() {
        this.motorSound.pause();
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
                        self.directions[self.directions.length - 1].y -= Math.abs(self.position.y) * 0.05;
                        for (var i = 0; i < self.shape.groups.length; i++) {
                            self.shape.groups[i].position.x += self.directions[i].x;
                            self.shape.groups[i].position.z += self.directions[i].z;
                            self.directions[i].y -= Math.abs(self.shape.groups[i].position.y) * 0.05;
                        }
                    } else {
                        self.directions[0].y -= Math.abs(self.position.y) * 0.05;
                        for (var i = 0; i < self.shape.groups.length; i++) {
                            self.shape.groups[i].position.x += self.directions[i].x;
                            self.shape.groups[i].position.y += self.directions[i].y;
                            self.shape.groups[i].position.z += self.directions[i].z;
                            self.directions[i].y -= Math.abs(self.shape.groups[i].position.y) * 0.05;
                        }
                    }
                });
            }());
            this.live = false;
        }
    };

    Kings.Player.prototype.restart = function() {
        this.motorSound.currentTime = 0;
        this.motorSound.play();
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

    Kings.Player.prototype.moveA = function() {
        this.position.x += 0.15;
    };

    Kings.Player.prototype.moveD = function() {
        this.position.x -= 0.15;
    };

    Kings.Player.prototype.slowDown = function() {
        if (this.velocity > 0.3) {
            this.velocity -= 0.05;
        }
    };

    Kings.Player.prototype.speedUp = function() {
        if (this.motorAccelSound.currentTime > 0.25) {
            this.motorAccelSound.currentTime = 0.15;
        }
        this.motorAccelSound.play();
        if (this.velocity < 1.0) {
            this.velocity += 0.05;
        }
    };
});
