define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.Face = function(parameters) {
        this.vertex = parameters.vertex;
        this.normal = parameters.normal;
        this.textureCoord = parameters.textureCoord;
    };

    Kings.Face.prototype = {
        constructor: Kings.Face,
    };
});
