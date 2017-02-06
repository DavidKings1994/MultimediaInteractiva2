define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.Gameobject = function(parameters) {
        this.position = parameters.position;
        this.rotation = parameters.rotation;
        this.scale = parameters.scale;
    };

    Kings.Gameobject.prototype = {
        constructor: Kings.Gameobject,

        update: function() {

        },

        draw: function() {

        }
    };
});
