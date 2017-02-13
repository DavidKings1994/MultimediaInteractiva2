define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    require('./RoadSection.js');

    Kings.Road = function(parameters) {
        Kings.GameObject.call(this, parameters);
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

    Kings.Road.prototype.draw = function() {
        for (var i = 0; i < this.sections.length; i++) {
            this.sections[i].draw();
        }
    };

    Kings.Road.CreateSection = function() {

    };
});
