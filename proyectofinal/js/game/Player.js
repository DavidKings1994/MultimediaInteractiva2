define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.Player = function(parameters) {
        var self = this;
        Kings.GameObject.call(this, parameters);
        this.body = new Kings.RigidBody({
            position: this.position,
            rotation: this.rotation,
            size: { x: 1, y: 2, z: 3 }
        });
        this.cameraMode = '3rdPerson';
        this.buttonPressed = false;
        this.live = true;
        this.deathAngle = 0;
        this.fuel = 100;
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
                        if (self.live) {
                            self.shape.groups[index].rotation.x += 25 * self.velocity;
                        }
                    });
                }());
            }
            if(this.shape.groups[i].name == 'frontWheel_HarleyDavidson.006') {
                (function() {
                    var index = (i + 0);
                    self.shape.groups[i].offset = { x: 0, y: 0.64168, z: 3.23467 };
                    self.addUpdateFunction(function(){
                        if (self.live) {
                            self.shape.groups[index].rotation.x += 25 * self.velocity;
                        }
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
        switch (this.cameraMode) {
            case '1stPerson': {
                this.camera.position.x = this.position.x;
                this.camera.position.y = this.position.y + 2.5 + Kings.Processing.map(Math.abs(this.rotation.x), 0, 45, 0, 1);
                this.camera.position.z = this.position.z + 1 - Kings.Processing.map(Math.abs(this.rotation.x), 0, 45, 0, 2);

                // var x = (2.5 * Math.sin(-this.rotation.z * (Math.PI / 180.0))) + this.position.x;
                // var y = (2.5 * Math.cos(-this.rotation.z * (Math.PI / 180.0))) + this.position.y;
                // this.camera.position.x = x;
                // this.camera.position.y = y + Kings.Processing.map(Math.abs(this.rotation.x), 0, 45, 0, 1);
                // this.camera.position.z = this.position.z + 1 - Kings.Processing.map(Math.abs(this.rotation.x), 0, 45, 0, 2);
                break;
            }
            case '3rdPerson': {
                this.camera.position.x = 0;
                this.camera.position.y = 2;
                this.camera.position.z = this.position.z - 7;
                break;
            }
        }
        if (this.fuel <= 0) {
            this.live = false;
            this.motorSound.pause();
        }

        var moving = false;
        var backflip = false;
        if (this.live) {
            this.fuel -= 0.05;
            this.position.z += this.velocity;
            if (Kings.keyboard.isDown(Kings.keyboard.keys.C)) {
                if (!this.buttonPressed) {
                    if (this.cameraMode == '1stPerson') {
                        this.cameraMode = '3rdPerson';
                    } else {
                        this.cameraMode = '1stPerson';
                    }
                    this.buttonPressed = true;
                }
            } else {
                this.buttonPressed = false;
            }
            if (Kings.keyboard.isDown(Kings.keyboard.keys.W)) {
                if (!Kings.keyboard.isDown(Kings.keyboard.keys.S)) {
                    if (this.blurId == null) {
                        this.blurId = Kings.game.mainLayer.addEffect(Kings.game.shaders.blur);
                    }
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
                if (!this.jumping && this.onFloor) {
                    this.jumping = true;
                    this.onFloor = false;
                }
            }
        } else {
            var x = (5 * Math.sin(this.deathAngle * (Math.PI / 180.0))) + this.position.x;
            var z = (5 * Math.cos(this.deathAngle * (Math.PI / 180.0))) + this.position.z;
            this.camera.position.x = x;
            this.camera.position.y = 2;
            this.camera.position.z = z;
            this.camera.aim = { x: this.position.x - x, y: -2, z: this.position.z - z };
            this.deathAngle += 2;
        }

        if (Kings.keyboard.isDown(Kings.keyboard.keys.R)) {
            this.restart();
        }
        if (Kings.keyboard.isDown(Kings.keyboard.keys.E)) {
            this.explode();
        }

        if (this.jumping) {
            if (this.position.y < -0.1) {
                this.position.y += Math.abs(this.position.y) * 0.15;
            } else {
                this.jumping = false;
            }
        } else if (this.position.y > -2 + Kings.Processing.map(Math.abs(this.rotation.x), 0, 45, 0, 0.2) && !this.jumping && !this.onFloor) {
            this.position.y -= Math.abs(this.position.y) * 0.15;
        } else {
            this.position.y = (-2 + Kings.Processing.map(Math.abs(this.rotation.x), 0, 45, 0, 0.2));
            this.onFloor = true;
        }

        if(!backflip) {
            if (this.rotation.x < -4) {
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
                if (this.blurId != null) {
                    Kings.game.mainLayer.removeEffect(this.blurId);
                    this.blurId = null;
                }
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
                this.directions.push({ x: Math.random() * dx, y: 1.0, z: Math.random() * dz });
            }
            this.jumping = true;
            this.onFloor = false;
            (function() {
                self.trashFunction = self.addUpdateFunction(function(){
                    if (self.position.y >= -2) {
                        for (var i = 0; i < self.shape.groups.length; i++) {
                            self.shape.groups[i].position.x += self.directions[i].x;
                            self.shape.groups[i].position.z += self.directions[i].z;
                        }
                    }
                });
            }());
            this.live = false;
        }
    };

    Kings.Player.prototype.restart = function() {
        this.deathAngle = 0;
        this.camera.aim = { x: 0, y: 0, z: 10 };
        this.motorSound.currentTime = 0;
        this.motorSound.play();
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
        this.fuel = 100;
    };

    Kings.Player.prototype.moveA = function() {
        this.position.x += 0.15;
        if (this.position.x > 5) {
            this.position.x = 5;
        }
    };

    Kings.Player.prototype.moveD = function() {
        this.position.x -= 0.15;
        if (this.position.x < -5) {
            this.position.x = -5;
        }
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

    Kings.Player.prototype.fillTank = function(cant) {
        this.fuel += cant;
        if (this.fuel > 100) {
            this.fuel = 100;
        }
    };

    Kings.Player.prototype.drainTank = function(cant) {
        this.fuel -= cant;
        if (this.fuel < 0) {
            this.explode();
        }
    };
});
