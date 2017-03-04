(function(root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'glMatrix'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery', 'glMatrix'));
    } else {
        root.myModule = factory(root.jquery, root.glMatrix);
    }
}(this, function($, glMatrix) {
    'use strict';

    var Kings = window.Kings || {};
    var Kings = ( function() {
        function Kings() {
            var self = this, dataSettings;
            self.init(true);
        }
        return Kings;
    }());

    window.Kings = Kings;

    require('./Shader.js');
    require('./Graphics.js');
    require('./Player.js');
    require('./Utils/LoadManager.js');
    require('./Utils/Keyboard.js');
    require('./GameObjects/Road/Road.js');
    require('./GameObjects/Items/Gasoline.js');
    require('./Geometry/Terrain.js');
    require('./Physics/RigidBody.js');
    require('./HUI/HUI.js');
    require('./HUI/FuelMeter.js');

    $.fn.initGame = function( parameters ) {
        var self = this;
        Kings.keyboard = new Kings.Keyboard();
        Kings.game = new Kings.Graphics({
            canvas: $(self)[0],
            camera: new Kings.Camera({
                position: { x: 0, y: 0, z: 0 },
            }),
            update: function() {
                if (Kings.keyboard.isDown(Kings.keyboard.keys.R)) {
                    for (var i = 0; i < Kings.game.elements.length; i++) {
                        if(Kings.game.elements[i].canReset != null) {
                            Kings.game.elements[i].restart();
                        }
                    }
                }
            },
            light: {
                ambiental: [1.0, 1.0, 1.0],
                directional: {
                    direction: [0.0, -0.3, -0.3],
                    color: [0.3, 0.3, 0.3]
                },
                spot: {
                    position: [0.0, 0.0, 0.0],
                    color: [1.0, 1.0, 1.0],
                    direction: [0.0, 0.0, -1.0]
                }
            }
        });
        Kings.game.shaders = {
            grayscale: require('./Processing/Postprocessing/Shaders/Grayscale.js'),
            blur: require('./Processing/Postprocessing/Shaders/SpeedBlur.js'),
            hdr: require('./Processing/Postprocessing/Shaders/HDR.js'),
            crt: require('./Processing/Postprocessing/Shaders/CRT.js'),
            basic: require('./Processing/Postprocessing/Shaders/Basic.js')
        };

        Kings.game.hui = new Kings.HUI();
        Kings.game.HUILayer = new Kings.Layer({
            name: 'HUI',
            draw: function() {
                Kings.game.hui.update();
                Kings.game.hui.draw();
            }
        });
        Kings.game.renderer.addLayer(Kings.game.HUILayer);
        Kings.game.mainLayer.addEffect(Kings.game.shaders.crt);

        Kings.AssetBundles = [];
        Kings.LoadManager.loadBundle('core', function() {
            console.log(Kings.AssetBundles[0]);
            Kings.game.player = new Kings.Player({
                velocity: 1,
                position: { x: 0, y: -2, z: 0 },
                shape: Kings.AssetBundles[0].content.HarleyDavidson1,
                motorSound: Kings.AssetBundles[0].content.motorIddle,
                motorAccelSound: Kings.AssetBundles[0].content.motorAccel,
                camera: Kings.game.camera
            });
            Kings.game.player.canReset = true;
            Kings.game.addElement(Kings.game.player);

            var fuelMeter = new Kings.FuelMeter({
                position: { x: 10, y: -6, z: 0 }
            });
            Kings.game.hui.addElement(fuelMeter);

            var road = new Kings.Road({
                texture: Kings.AssetBundles[0].content.road,
                position: { x: 0, y: -2, z: 0},
                sectionSize: 12,
                numberOfSections: 10,
                update: function() {
                    road.locatePlayer(Kings.game.player.position);
                    if (Kings.game.player.live) {
                        road.terrainRight.pase = Kings.game.player.getVelocity() * 0.2;
                        road.terrainLeft.pase = Kings.game.player.getVelocity() * 0.2;
                    } else {
                        road.terrainRight.pase = 0;
                        road.terrainLeft.pase = 0;
                    }
                    road.terrainRight.position.z = Kings.game.player.position.z + 35;
                    road.terrainLeft.position.z = Kings.game.player.position.z + 35;
                    fuelMeter.setLevel(Kings.game.player.fuel);
                    if (road.sections[road.sections.length - 1].id % 50 == 0) {
                        Kings.game.player.velocity += 0.02;
                        if (Kings.game.player.velocity > 3) {
                            Kings.game.player.velocity = 3;
                        }
                        road.difficulty = Math.floor(Kings.Processing.map(Kings.game.player.velocity, 1, 3, 4, 9));
                    }
                }
            });
            road.canReset = true;
            Kings.game.addElement(road);

            Kings.game.ready = true;
        });
    };
}));
