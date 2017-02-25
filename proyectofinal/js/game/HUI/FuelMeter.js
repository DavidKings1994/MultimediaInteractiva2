define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.FuelMeter = function(parameters) {
        this.position = parameters.position || { x: 0, y: 0, z: 0 };
        this.meter = new Kings.Plane({
            width: 3,
            height: 3,
            texture: Kings.AssetBundles[0].content.fuelMeter
        });
        this.neddle = new Kings.Plane({
            width: 3,
            height: 3,
            texture: Kings.AssetBundles[0].content.meterNeedle
        });
        this.level = 100;
    };

    Kings.FuelMeter.prototype = {
        constructor: Kings.FuelMeter,

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
            this.meter.draw();
            this.neddle.draw();
            Kings.GL.mvPopMatrix();
        }
    };
});
