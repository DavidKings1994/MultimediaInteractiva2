define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.SlowTimeMeter = function(parameters) {
        this.position = parameters.position || { x: 0, y: 0, z: 0 };
        this.meter = new Kings.Plane({
            width: 12,
            height: 3,
            texture: Kings.AssetBundles[0].content.lifeBar
        });
        this.bar = new Kings.Plane({
            width: 8.25,
            height: 0.5,
            texture: Kings.AssetBundles[0].content.bar,
        });
        this.level = 100;
        this.shader = new Kings.Shader({
            gl: gl,
            vertexShaderSource: [
                'attribute vec3 aVertexPosition;',
                'attribute vec2 aTextureCoord;',
                'uniform mat4 uMVMatrix;',
                'uniform mat4 uPMatrix;',
                'varying vec2 vTextureCoord;',
                'void main(void) {',
                   'gl_Position = uPMatrix * (uMVMatrix * vec4(aVertexPosition, 1.0));',
                   'vTextureCoord = aTextureCoord;',
                '}'
            ].join("\n"),
            fragmentShaderSource: [
                'precision mediump float;',
                'varying vec2 vTextureCoord;',
                'uniform sampler2D uSampler;',
                'void main(void) {',
                    'vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));',
                    'gl_FragColor = vec4(textureColor.rgb, textureColor.a);',
                '}'
            ].join("\n")
        });
    };

    Kings.SlowTimeMeter.prototype = {
        constructor: Kings.SlowTimeMeter,

        setLevel: function(l) {
            if (l >= 0 && l <= 100) {
                this.level = l;
            }
        },

        update: function() {
            this.offset = Kings.Processing.map(this.level, 0, 100, -7, 1.25);
        },

        draw: function() {
            Kings.GL.mvPushMatrix();
            Kings.GL.mvTranslate(this.position);
            Kings.GL.mvPushMatrix();
            Kings.GL.mvTranslate({ x: this.offset, y: 0, z: 0 });
            this.bar.draw(this.shader);
            Kings.GL.mvPopMatrix();
            this.meter.draw(this.shader);
            Kings.GL.mvPopMatrix();
        }
    };
});
