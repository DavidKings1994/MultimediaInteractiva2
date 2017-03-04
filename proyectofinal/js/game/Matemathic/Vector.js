define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.Vector = function(parameters) {
        this.x = parameters.x;
        this.y = parameters.y;
        this.z = parameters.z;
    };

    Kings.Vector.prototype = {
        constructor: Kings.Vector,

        crossProduct: function(v2) {
            return new Kings.Vector({
                x:   ( (this.y * v2.z) - (this.z * v2.y) ),
                y: - ( (this.x * v2.z) - (this.z * v2.x) ),
                z:   ( (this.x * v2.y) - (this.y * v2.x) )
            });
        },

        dotProduct: function(v) {
            return (this.x * v.x) + (this.y * v.y) + (this.z * v.z);
        },

        magnitude: function() {
            return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
        },

        normalize: function() {
            var mag = this.magnitude();
            return new Kings.Vector({
                x: this.x / mag,
                y: this.y / mag,
                z: this.z / mag
            });
        },

        angleBetweenVectors: function(v2) {
            var vec1 = new Kings.Vector({ x: this.x, y: this.y, z: this.z });
            var vec2 = new Kings.Vector({ x: v2.x, y: v2.y, z: v2.z });

            vec1 = vec1.normalize();
            vec2 = vec2.normalize();

            var cosine = vec1.dotProduct(vec2);

            if (cosine > 1.0) {
                return 0;
            } else {
                return Math.acos(cosine);
            }
        },

        clone: function() {
            return new Kings.Vector({ x: this.x, y: this.y, z: this.z });
        },

        phi: function() {
            var angle = Math.atan2(this.x,this.y) * (180 / Math.PI);
            if (angle < 0) {
                angle += 360;
            }
            return angle;
        }
    };
});
