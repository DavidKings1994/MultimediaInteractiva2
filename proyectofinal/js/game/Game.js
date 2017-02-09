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
    require('./Utils/LoadManager.js');

    Kings.prototype.keyHandler = function(event) {
        var up = (event.type == 'keyup');

        if(!up && event.type !== 'keydown')
            return;

        switch(event.keyCode){

        case 87: // w
        case 38: // forward

            break;
        case 83: // s
        case 40: // backward

            break;
        case 65: // a
        case 37: // left

            break;
        case 68: // d
        case 39: // right

            break;
        }
    };

    Kings.prototype.onKeyDown = function(event) {
        KingsGame.prototype.keyHandler( event );
    };

    Kings.prototype.onKeyDown = function(event) {
        KingsGame.prototype.keyHandler( event );
    };

    $.fn.initGame = function( parameters ) {
        var self = this;
        Kings.game = new Kings.Graphics($(self)[0]);
        Kings.AssetBundles = [];
        Kings.LoadManager.loadBundle('core', function() {
            console.log('todo cargado');
            console.log(Kings.AssetBundles);
            Kings.game.addElement(new Kings.Triangle({
                texture: Kings.AssetBundles[0].content.logo
            }));

            document.addEventListener( 'keydown', Kings.prototype.onKeyDown, false );
            document.addEventListener( 'keyup', Kings.prototype.onKeyUp, false );
        });
    };
}));
