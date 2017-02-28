define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    require('./RoadSection.js');
    require('./../Obstacles/Barrier.js');
    require('./../Obstacles/Cone.js');
    require('./../Obstacles/OilDrum.js');

    Kings.Road = function(parameters) {
        Kings.GameObject.call(this, parameters);
        this.gameUpdate = function() { parameters.update() };
        this.difficulty = 0;
        this.playerIndexLocation = 0;
        this.sections = [];
        this.numberOfSections = parameters.numberOfSections || 4;
        this.sectionSize = parameters.sectionSize || 4;
        for (var i = 0; i < this.numberOfSections; i++) {
            if(i>1) {
                this.sections.push(new Kings.RoadSection({
                    id: i,
                    position: { x: 0, y: this.position.y, z: i * (this.sectionSize) },
                    sectionSize: this.sectionSize,
                    texture: this.texture
                }));
            } else {
                this.sections.push(new Kings.RoadSection({
                    id: i,
                    position: { x: 0, y: this.position.y, z: i * (this.sectionSize) },
                    sectionSize: this.sectionSize,
                    texture: this.texture
                }));
            }
        }
        this.terrainLeft = new Kings.Terrain({
            position: { x: 16, y: this.position.y, z: 0},
            rotation: { x: 90, y: 0, z: 0},
            texture: Kings.AssetBundles[0].content.ground2,
            width: 20.0,
            height: 80.0,
            cols: 10.0,
            rows: 10.0,
            maxHeight: 10,
            staticEdge: 'bottom'
        });
        this.terrainRight = new Kings.Terrain({
            position: { x: -16, y: this.position.y, z: 0},
            rotation: { x: 90, y: 0, z: 0},
            texture: Kings.AssetBundles[0].content.ground2,
            width: 20.0,
            height: 80.0,
            cols: 10.0,
            rows: 10.0,
            maxHeight: 10,
            staticEdge: 'top'
        });
        this.combinations = [ //0 = nada, 1 = barreera/gasolina, 2 = barril, 3 = gasolina
            [0,0,0,0,0],
            [2,2,0,0,0],
            [0,0,0,2,2],
            [2,2,2,0,0],
            [0,0,2,2,2],
            [2,2,1,2,2],
            [2,2,2,2,1],
            [1,2,2,2,2],
            [0,0,1,2,2],
            [2,2,1,0,0],
            [0,0,3,0,0],
        ];
        this.pastCombination = 0;
    };

    Kings.Road.prototype = Object.create(Kings.GameObject.prototype);

    Kings.Road.prototype.update = function(v) {
        if (Kings.keyboard.isDown(Kings.keyboard.keys.H)) {
            this.difficulty++;
            if (this.difficulty == 4) {
                this.difficulty = 0;
            }
        }
        this.gameUpdate();
        this.terrainRight.update();
        this.terrainLeft.update();
        this.sections[this.playerIndexLocation].active = true;
        if(this.playerIndexLocation > 1) {
            var section = new Kings.RoadSection({
                id: this.sections[this.numberOfSections - 1].id + 1,
                position: { x: 0, y: this.position.y, z: (this.sections[this.numberOfSections - 1].id + 1) * (this.sectionSize) },
                sectionSize: this.sectionSize,
                texture: this.texture,
            });
            var elements = [];
            if (this.sections[this.numberOfSections - 1].id > 10 && this.sections[this.numberOfSections - 1].id % 4 == 0) {
                var elementType = Math.floor(Math.random() * this.combinations.length);
                while (elementType == this.pastCombination) {
                    elementType = Math.floor(Math.random() * this.combinations.length);
                }
                this.pastCombination = elementType;
                for (var i = 0; i < this.combinations[elementType].length; i++) {
                    var x = i * (this.sectionSize / 5) - (this.sectionSize / 2.5);
                    switch (this.combinations[elementType][i]) {
                        case 0: {
                            //nada
                            break;
                        }
                        case 1: {
                            elements.push(new Kings.Barrier({
                                position: { x: x, y: -2, z: section.position.z },
                            }));
                            elements.push(new Kings.Gasoline({
                                position: { x: x, y: 0, z: section.position.z },
                            }));
                            // elements.push(new Kings.Cone({
                            //     position: { x: x, y: -2, z: section.position.z }
                            // }));
                            break;
                        }
                        case 2: {
                            elements.push(new Kings.OilDrum({
                                position: { x: x, y: -2, z: section.position.z }
                            }));
                            break;
                        }
                        case 3: {
                            elements.push(new Kings.Gasoline({
                                position: { x: x, y: -1.7, z: section.position.z }
                            }));
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                }
            }
            section.objects = elements;
            this.sections.push(section);
            this.sections.splice(0,1);
        }
        for (var i = 0; i < this.sections.length; i++) {
            this.sections[i].update();
        }
    };

    Kings.Road.prototype.draw = function() {
        this.terrainRight.draw();
        this.terrainLeft.draw();
        for (var i = 0; i < this.sections.length; i++) {
            this.sections[i].draw();
        }
    };

    Kings.Road.prototype.locatePlayer = function(v) {
        for (var i = 0; i < this.sections.length; i++) {
            if(
                v.z > (this.sections[i].position.z - this.sectionSize) &&
                v.z < (this.sections[i].position.z + this.sectionSize)
            ) {
                this.playerIndexLocation = i;
            }
        }
    },

    Kings.Road.prototype.insideRoad = function(position) {
        if((position.x > -this.sectionSize && position.x < this.sectionSize)) {
            return true;
        }
        return false;
    },

    Kings.Road.prototype.restart = function() {
        this.sections = [];
        for (var i = 0; i < this.numberOfSections; i++) {
            if(i>1) {
                this.sections.push(new Kings.RoadSection({
                    id: i,
                    position: { x: 0, y: this.position.y, z: i * (this.sectionSize) },
                    sectionSize: this.sectionSize,
                    texture: this.texture
                }));
            } else {
                this.sections.push(new Kings.RoadSection({
                    id: i,
                    position: { x: 0, y: this.position.y, z: i * (this.sectionSize) },
                    sectionSize: this.sectionSize,
                    texture: this.texture
                }));
            }
        }
    };
});
