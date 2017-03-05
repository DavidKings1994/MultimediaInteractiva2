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
        this.cameraMode = 1;
        this.buttonPressed = false;
        this.live = true;
        this.deathAngle = 0;
        this.fuel = 100;
        this.slowTime = 100;
        this.motorSound = parameters.motorSound;
        this.motorAccelSound = parameters.motorAccelSound;
        this.velocity = (parameters.velocity + 0) || 0;
        this.aceleration = 0;
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
        Kings.AssetBundles[0].content.ThroughTheFireandFlames.volume = 0.7;
        Kings.AssetBundles[0].content.ThroughTheFireandFlames.loop = true;
        Kings.AssetBundles[0].content.ThroughTheFireandFlames.play();
    };

    Kings.Player.prototype = Object.create(Kings.GameObject.prototype);

    Kings.Player.prototype.update = function() {
        Kings.GameObject.prototype.update.call(this);
        this.shape.update();
        switch (this.cameraMode) {
            case 0: {
                this.camera.position.x = this.position.x;
                this.camera.position.y = this.position.y + 2.5 + Kings.Processing.map(Math.abs(this.rotation.x), 0, 45, 0, 1);
                this.camera.position.z = this.position.z + 1 - Kings.Processing.map(Math.abs(this.rotation.x), 0, 45, 0, 2);
                this.camera.aim = { x: 0, y: 0, z: 10 };

                Kings.game.light.spot.position = [
                    this.camera.position.x - this.position.x,
                    this.camera.position.y - this.position.y,
                    this.camera.position.z - this.position.z - 1
                ];
                break;
            }
            case 1: {
                this.camera.position.x = 0;
                this.camera.position.y = 2;
                this.camera.position.z = this.position.z - 7;
                this.camera.aim = { x: 0, y: 0, z: 10 };

                Kings.game.light.spot.position = [
                    this.camera.position.x + this.position.x,
                    this.camera.position.y + this.position.y,
                    this.camera.position.z - this.position.z + 14
                ];
                break;
            }
            case 2: {
                this.camera.position.x = 0;
                this.camera.position.y = 15;
                this.camera.position.z = this.position.z + 7;
                this.camera.aim = { x: 0, y: -2, z: 7};

                Kings.game.light.spot.position = [
                    this.camera.position.x - this.position.x,
                    this.camera.position.y - this.position.y,
                    this.camera.position.z - this.position.z
                ];
                break;
            }
        }

        if (this.fuel <= 0) {
            this.live = false;
            this.motorSound.pause();
            Kings.AssetBundles[0].content.alert.pause();
            Kings.AssetBundles[0].content.alert.currentTime = 0;
        } else {
            if (this.fuel < 30) {
                Kings.AssetBundles[0].content.alert.loop = true;
                Kings.AssetBundles[0].content.alert.play();
            } else {
                Kings.AssetBundles[0].content.alert.pause();
                Kings.AssetBundles[0].content.alert.currentTime = 0;
            }
        }

        var moving = false;
        var backflip = false;
        if (this.live) {
            this.fuel -= 0.035;
            this.position.z += this.velocity + (this.velocity * this.aceleration);
            if (Kings.keyboard.isDown(Kings.keyboard.keys.C)) {
                if (!this.buttonPressed) {
                    this.cameraMode++;
                    if (this.cameraMode > 1) {
                        this.cameraMode = 0;
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
            if (Kings.keyboard.isDown(Kings.keyboard.keys.S) && this.slowTime > 0) {
                if (!Kings.keyboard.isDown(Kings.keyboard.keys.W)) {
                    this.slowDown();
                    backflip = true;
                    this.slowTime -= 0.2;
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
            var x = (10 * Math.sin(this.deathAngle * (Math.PI / 180.0))) + this.position.x;
            var z = (10 * Math.cos(this.deathAngle * (Math.PI / 180.0))) + this.position.z;
            this.camera.position.x = x;
            this.camera.position.y = 2;
            this.camera.position.z = z;
            this.camera.aim = { x: this.position.x - x, y: -2, z: this.position.z - z };
            this.deathAngle += 0.7;
            if (this.blurId != null) {
                Kings.game.mainLayer.removeEffect(this.blurId);
                this.blurId = null;
            }
            if (this.deathCam == null) {
                this.deathCam = Kings.game.mainLayer.addEffect(Kings.game.shaders.grayscale);
            }
            Kings.AssetBundles[0].content.ThroughTheFireandFlames.pause();
        }

        if (Kings.keyboard.isDown(Kings.keyboard.keys.R)) {
            this.restart();
        }
        if (Kings.keyboard.isDown(Kings.keyboard.keys.E)) {
            this.explode();
        }

        var newy = Math.abs(this.position.y) * ( backflip ? (1 + this.aceleration) /2 : 0.3);
        if (this.jumping) {
            if (this.position.y < -0.1) {
                this.position.y += Math.abs(this.position.y) * ( backflip ? (1 + this.aceleration) / 2 : 0.2);
            } else {
                this.jumping = false;
            }
        } else if (this.position.y - newy > -2 + Kings.Processing.map(Math.abs(this.rotation.x), 0, 45, 0, 0.2) && !this.jumping && !this.onFloor) {
            this.position.y -= newy;
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

        if ((!Kings.keyboard.isDown(Kings.keyboard.keys.S) || this.slowTime <= 0) && !Kings.keyboard.isDown(Kings.keyboard.keys.W)) {
            if (this.aceleration > 0.1) {
                this.aceleration -= 0.05;
                if (this.blurId != null) {
                    Kings.game.mainLayer.removeEffect(this.blurId);
                    this.blurId = null;
                }
            } else if (this.aceleration < -0.1) {
                this.aceleration += 0.05;
            } else {
                this.aceleration = 0;
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
                    if (self.shape.groups[1].position.y >= -2) {
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
        Kings.AssetBundles[0].content.ThroughTheFireandFlames.currentTime = 0;
        Kings.AssetBundles[0].content.ThroughTheFireandFlames.play();
        this.velocity = 1;
        if (this.deathCam != null) {
            Kings.game.mainLayer.removeEffect(this.deathCam);
            this.deathCam = null;
        }
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
        this.slowTime = 100;
    };

    Kings.Player.prototype.moveA = function() {
        this.position.x += 0.3;
        if (this.position.x > 5) {
            this.position.x = 5;
        }
    };

    Kings.Player.prototype.moveD = function() {
        this.position.x -= 0.3;
        if (this.position.x < -5) {
            this.position.x = -5;
        }
    };

    Kings.Player.prototype.slowDown = function() {
        if (this.aceleration > -0.9) {
            this.aceleration -= 0.05;
        }
    };

    Kings.Player.prototype.speedUp = function() {
        if (this.motorAccelSound.currentTime > 0.26) {
            this.motorAccelSound.currentTime = 0.19;
        }
        this.motorAccelSound.play();
        if (this.aceleration < 0.5) {
            this.aceleration += 0.05;
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

    Kings.Player.prototype.fillTime = function(cant) {
        this.slowTime += cant;
        if (this.slowTime > 100) {
            this.slowTime = 100;
        }
    };

    Kings.Player.prototype.getVelocity = function() {
        return this.velocity + this.aceleration;
    };
});
