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
    require('./Geometry/Terrain.js');

    $.fn.initGame = function( parameters ) {
        var self = this;
        Kings.game = new Kings.Graphics({
            canvas: $(self)[0],
            camera: new Kings.Camera({
                position: { x: 0, y: 0, z: 0 },
            }),
            update: function() {

            }
        });
        var grayscale = require('./Processing/Postprocessing/Shaders/Grayscale.js');
        Kings.game.renderer.addEffect(grayscale);
        Kings.AssetBundles = [];
        Kings.LoadManager.loadBundle('core', function() {
            console.log(Kings.AssetBundles[0]);
            Kings.game.player = new Kings.Player({
                velocity: 0.7,
                position: { x: 0, y: -2, z: 0 },
                shape: Kings.AssetBundles[0].content.HarleyDavidson1,
                motorSound: Kings.AssetBundles[0].content.motorIddle,
                motorAccelSound: Kings.AssetBundles[0].content.motorAccel,
                camera: Kings.game.camera
            });
            Kings.game.addElement(Kings.game.player);

            var road = new Kings.Road({
                texture: Kings.AssetBundles[0].content.road,
                position: { x: 0, y: -2, z: 0},
                sectionSize: 12,
                numberOfSections: 10,
                update: function() {
                    road.locatePlayer(Kings.game.player.position);
                    if (Kings.game.player.live) {
                        road.terrainRight.pase = Kings.game.player.velocity * 0.2;
                        road.terrainLeft.pase = Kings.game.player.velocity * 0.2;
                    } else {
                        road.terrainRight.pase = 0;
                        road.terrainLeft.pase = 0;
                    }
                    road.terrainRight.position.z = Kings.game.player.position.z + 35;
                    road.terrainLeft.position.z = Kings.game.player.position.z + 35;
                }
            })
            Kings.game.addElement(road);

            // var barrier = new Kings.GameObject({
            //     position: { x: 0, y: -2, z: 0 },
            //     rotation: { x: 0, y: 0, z: 0 },
            //     shape: Kings.AssetBundles[0].content.oildrum
            // });
            // barrier.addUpdateFunction(function() {
            //     barrier.position.z = Kings.game.player.position.z + 5;
            // });
            // Kings.game.addElement(barrier);
            //
            // var barrier2 = new Kings.GameObject({
            //     position: { x: 3, y: -2, z: 0 },
            //     rotation: { x: 0, y: -180, z: 0 },
            //     shape: Kings.AssetBundles[0].content.barriere
            // });
            // barrier2.addUpdateFunction(function() {
            //     barrier2.position.z = Kings.game.player.position.z + 5;
            // });
            // Kings.game.addElement(barrier2);
            //
            // var barrier3 = new Kings.GameObject({
            //     position: { x: -3, y: -2, z: 0 },
            //     rotation: { x: 0, y: -180, z: 0 },
            //     shape: Kings.AssetBundles[0].content.cone
            // });
            // barrier3.addUpdateFunction(function() {
            //     barrier3.position.z = Kings.game.player.position.z + 5;
            // });
            // Kings.game.addElement(barrier3);

            Kings.keyboard = new Kings.Keyboard();
        });
    };
}));
