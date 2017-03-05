define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.Score = function(parameters) {
        this.position = parameters.position || { x: 0, y: 0, z: 0 };
        this.score = 0;
    };

    Kings.Score.prototype = {
        constructor: Kings.Score,

        setLevel: function(l) {
            if (l >= 0 && l <= 100) {
                this.level = l;
            }
        },

        update: function() {
            this.neddle.rotation.z = -Kings.Processing.map(this.level, 0, 100, 0, 270);
        },

        draw: function() {
            Kings.GL.mvPushMatrix();
            Kings.GL.mvTranslate(this.position);
            this.meter.draw(this.shader);
            this.neddle.draw(this.shader);
            Kings.GL.mvPopMatrix();
        }
    };
});
