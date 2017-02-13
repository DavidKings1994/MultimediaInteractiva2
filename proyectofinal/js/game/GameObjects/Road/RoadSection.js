define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.RoadSection = function(parameters) {
        parameters.rotation = { x: 90, y: 0, z: 0};
        parameters.shape = new Kings.Plane({
            height: parameters.sectionSize,
            width: parameters.sectionSize,
            texture: parameters.texture
        });
        Kings.GameObject.call(this, parameters);
    };

    Kings.RoadSection.prototype = Object.create(Kings.GameObject.prototype);

    Kings.RoadSection.prototype.destroy = function() {

    };
});
