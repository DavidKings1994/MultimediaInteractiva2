define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    require('./RoadSection.js');

    Kings.Road = function(parameters) {
        Kings.GameObject.call(this, parameters);
        this.gameUpdate = function() { parameters.update() };
        this.playerIndexLocation = 0;
        this.sections = [];
        this.numberOfSections = parameters.numberOfSections || 4;
        this.sectionSize = parameters.sectionSize || 4;
        console.log(this);
        for (var i = 0; i < this.numberOfSections; i++) {
            if(i>1) {
                this.sections.push(new Kings.RoadSection({
                    id: i,
                    position: { x: 0, y: this.position.y, z: i * (this.sectionSize * 2) },
                    sectionSize: this.sectionSize,
                    texture: this.texture
                    //hazard: KingsGame.HAZARDS.meteorites,
                    //dificulty: KingsGame.DIFICULTY.easy
                }));
            } else {
                this.sections.push(new Kings.RoadSection({
                    id: i,
                    position: { x: 0, y: this.position.y, z: i * (this.sectionSize * 2) },
                    sectionSize: this.sectionSize,
                    texture: this.texture
                }));
            }
        }
    };

    Kings.Road.prototype = Object.create(Kings.GameObject.prototype);

    Kings.Road.prototype.update = function(v) {
        this.gameUpdate();
        if(this.playerIndexLocation > 1) {
            this.sections.push(new Kings.RoadSection({
                id: this.sections[this.numberOfSections - 1].id + 1,
                position: { x: 0, y: this.position.y, z: (this.sections[this.numberOfSections - 1].id + 1) * (this.sectionSize * 2) },
                sectionSize: this.sectionSize,
                texture: this.texture
            }));
            this.sections[0].destroy();
            this.sections.splice(0,1);
        }
        for (var i = 0; i < this.sections.length; i++) {
            this.sections[i].update();
        }
    };

    Kings.Road.prototype.draw = function() {
        for (var i = 0; i < this.sections.length; i++) {
            this.sections[i].draw();
        }
    };

    Kings.Road.prototype.locatePlayer = function(v) {
        for (var i = 0; i < this.sections.length; i++) {
            if(
                (
                    v.x > (this.sections[i].position.x - this.sectionSize) &&
                    v.x < (this.sections[i].position.x + this.sectionSize)
                ) && (
                    v.z > (this.sections[i].position.z - this.sectionSize) &&
                    v.z < (this.sections[i].position.z + this.sectionSize)
                )
            ) {
                this.playerIndexLocation = i;
                console.log(i);
            }
        }
    },

    Kings.Road.prototype.insideRoad = function(position) {
        if((position.x > -this.sectionSize && position.x < this.sectionSize)) {
            return true;
        }
        return false;
    },

    Kings.Road.prototype.CreateSection = function() {

    };
});
