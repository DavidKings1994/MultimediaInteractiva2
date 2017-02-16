define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.Processing = {
        map: function(value, low1, high1, low2, high2) {
            return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
        },

        calculateNormal: function(p1, p2, p3) {
            var v1 = glMatrix.vec3.fromValues(p1[0] - p3[0], p1[1] - p3[1], p1[2] - p3[2]);
            var v2 = glMatrix.vec3.fromValues(p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]);
            var normal = glMatrix.vec3.create();
            glMatrix.vec3.cross(normal, v1, v2);
            glMatrix.vec3.normalize(normal, normal);
            return normal;
        }
    };
});
