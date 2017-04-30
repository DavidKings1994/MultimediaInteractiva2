define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.SkySphere = function(parameters) {
        this.position = parameters.position || { x: 0, y: 0, z: 0 };
        this.rotation = parameters.rotation || { x: 0, y: 0, z: 0 };
        this.radius = parameters.radius || 50;

        this.cloudsRotationRatio = 0.5;
        this.moonRotationRatio = 0.2;

        this.cloudsRotation = 0;

        this.clouds = new Kings.Sphere({
            radius: this.radius,
            slices: 32,
            stacks: 32,
            texture: Kings.AssetBundles[0].content.clouds,
            // rotation: { x: 0, y: 90, z: 0 }
        });
        this.moon = new Kings.Sphere({
            radius: this.radius + 10,
            slices: 32,
            stacks: 32,
            texture: Kings.AssetBundles[0].content.moon,
            rotation: { x: 0, y: 90, z: 0 }
        });
    };

    Kings.SkySphere.prototype = {
        constructor: Kings.SkySphere,

        update: function() {
            this.position.z = Kings.game.player.position.z + 35;
            if (Kings.game.player.live) {
                this.cloudsRotation += Kings.game.player.getVelocity();
            }
        },

        draw: function() {
            Kings.GL.mvPushMatrix();
            Kings.GL.mvTranslate(this.position);
            this.moon.draw(Kings.game.shaders.basic);
            Kings.GL.mvPopMatrix();

            Kings.GL.mvPushMatrix();
            Kings.GL.mvTranslate(this.position);

            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.enable(gl.BLEND);
            gl.disable(gl.DEPTH_TEST);

            Kings.GL.mvPushMatrix();
            Kings.GL.mvRotate(90, 0, 0, 1);
            Kings.GL.mvRotate(this.cloudsRotation, 0, 1, 0);
            Kings.GL.mvScale({ x: 1, y: 2, z: 1 });
            this.clouds.draw(Kings.game.shaders.basic);
            Kings.GL.mvPopMatrix();

            gl.disable(gl.BLEND);
            gl.enable(gl.DEPTH_TEST);

            Kings.GL.mvPopMatrix();
        }
    };
});
