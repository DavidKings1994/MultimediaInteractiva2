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
    require('./SkySphere.js');
    require('./Utils/LoadManager.js');
    require('./Utils/Keyboard.js');
    require('./GameObjects/Road/Road.js');
    require('./GameObjects/Items/Gasoline.js');
    require('./GameObjects/Items/Time.js');
    require('./Geometry/Terrain.js');
    require('./Physics/RigidBody.js');
    require('./HUI/HUI.js');
    require('./HUI/FuelMeter.js');
    require('./HUI/SlowTimeMeter.js');
    require('./HUI/Score.js');

    var store = require('./../store/store.js');

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
                    store.commit('setGameOver', false);
                }
            },
            light: {
                ambiental: [1.0, 1.0, 1.0],
                directional: {
                    direction: [0.0, -0.3, -0.3],
                    color: [0.4, 0.4, 0.4]
                },
                spot: {
                    position: [0.0, 0.0, 0.0],
                    color: [1.0, 1.0, 1.0],
                    direction: [0.0, 0.0, -1.0]
                }
            }
        });

        document.addEventListener( 'keyup', function(event) {
            var x = event.which || event.keyCode;
            if (x == 27) {
                Kings.game.pause();
                store.commit('setGameState', !Kings.game.paused);
            }
        }, false );

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

            $( document ).on( "volumeSet", function() {
                var masterVolume = parseFloat(store.state.configuration.masterVolume) / 100;
                Kings.AssetBundles[0].content.alert.volume = parseFloat(store.state.configuration.sfx) / 100 * masterVolume;
                Kings.AssetBundles[0].content.bubbling.volume = parseFloat(store.state.configuration.sfx) / 100 * masterVolume;
                Kings.AssetBundles[0].content.crash.volume = parseFloat(store.state.configuration.sfx) / 100 * masterVolume;
                Kings.AssetBundles[0].content.explosion.volume = parseFloat(store.state.configuration.sfx) / 100 * masterVolume;
                Kings.AssetBundles[0].content.motorAccel.volume = parseFloat(store.state.configuration.sfx) / 100 * masterVolume;
                Kings.AssetBundles[0].content.motorIddle.volume = parseFloat(store.state.configuration.sfx) / 100 * masterVolume;
                Kings.AssetBundles[0].content.time.volume = parseFloat(store.state.configuration.sfx) / 100 * masterVolume;
                Kings.AssetBundles[0].content.ThroughTheFireandFlames.volume = parseFloat(store.state.configuration.music) / 100 * masterVolume;
            });
            $( document ).trigger( "volumeSet" );

            $( document ).on( "gamePause", function() {
                Kings.game.pause();
                store.commit('pauseGame', !Kings.game.paused);
            });
            $( document ).trigger( "gamePause" );

            var sky = new Kings.SkySphere({});
            Kings.game.addElement(sky);

            Kings.game.player = new Kings.Player({
                velocity: 2,
                position: new Kings.Vector({x: 0, y: -2, z: 0 }),
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
            var slowTimeMeter = new Kings.SlowTimeMeter({
                position: { x: -6, y: 6, z: 0 }
            });
            var score = new Kings.Score({
                position: { x: 10, y: 6, z: 0 }
            });
            Kings.game.hui.addElement(fuelMeter);
            Kings.game.hui.addElement(slowTimeMeter);
            Kings.game.hui.addElement(score);

            var road = new Kings.Road({
                texture: Kings.AssetBundles[0].content.road,
                position: { x: 0, y: -2, z: 0},
                sectionSize: 12,
                numberOfSections: 8,
                update: function() {
                    road.locatePlayer(Kings.game.player.position);
                    if (Kings.game.player.live) {
                        road.terrainRight.pase = Kings.game.player.getVelocity() * 0.05;
                        road.terrainLeft.pase = Kings.game.player.getVelocity() * 0.05;
                        score.score = road.sections[road.playerIndexLocation].id;
                    } else {
                        road.terrainRight.pase = 0;
                        road.terrainLeft.pase = 0;
                    }
                    road.terrainRight.position.z = Kings.game.player.position.z + 35;
                    road.terrainLeft.position.z = Kings.game.player.position.z + 35;
                    fuelMeter.setLevel(Kings.game.player.fuel);
                    slowTimeMeter.setLevel(Kings.game.player.slowTime);
                    if (road.sections[road.sections.length - 1].id % 50 == 0) {
                        Kings.game.player.velocity += 0.05;
                        if (Kings.game.player.velocity > 3) {
                            Kings.game.player.velocity = 3;
                        }
                        road.difficulty = Math.floor(Kings.Processing.map(Kings.game.player.velocity, 2, 5, 4, 7));
                    }
                }
            });
            road.canReset = true;
            Kings.game.addElement(road);

            Kings.game.ready = true;
            store.commit('setGameReady');
        });
    };
}));
