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
        Kings.AssetBundles = [];
        Kings.LoadManager.loadBundle('core', function() {
            console.log(Kings.AssetBundles[0]);
            Kings.game.player = new Kings.Player({
                velocity: 0.7,
                position: { x: 0, y: -2, z: 0 },
                shape: Kings.AssetBundles[0].content.HarleyDavidson1,
                camera: Kings.game.camera
            });
            Kings.game.addElement(Kings.game.player);

            var road = new Kings.Road({
                texture: Kings.AssetBundles[0].content.road,
                position: { x: 0, y: -2, z: 0},
                sectionSize: 4,
                numberOfSections: 10,
                update: function() {
                    road.locatePlayer(Kings.game.player.position);
                    road.terrainRight.position.z = Kings.game.player.position.z + 22;
                    road.terrainLeft.position.z = Kings.game.player.position.z + 22;
                }
            })
            Kings.game.addElement(road);

            Kings.keyboard = new Kings.Keyboard();
        });
    };
}));
