define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    var speedBlur = new Kings.Shader({
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
                'vec2 dir = vec2(vTextureCoord.s - 0.5, vTextureCoord.t - 0.5);',
                'vec2 textCoorDir = normalize(dir) / 10.0;',
                'for(int i = 0; i < 10; i++) {',
                    'vec2 newpos = vec2(vTextureCoord.s - textCoorDir.x, vTextureCoord.t - textCoorDir.y);',
                    'if((newpos.x <= 1.0 || newpos.x >= 0.0) && (newpos.y <= 1.0 || newpos.y >= 0.0)) {',
                        'vec4 blured = texture2D(uSampler, vec2(newpos.x, newpos.y));',
                        'textureColor = mix(textureColor, blured, max(1.0 - (length(dir) * 2.0), 0.2));',
                    '}',
                    'textCoorDir = textCoorDir * min((length(dir) * 2.0), 0.8);',
                '}',
                'gl_FragColor = textureColor;',
            '}'
        ].join("\n")
    });

    return speedBlur;
});
