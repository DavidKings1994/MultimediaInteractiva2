define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    var basic = new Kings.Shader({
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
                // 'if(gl_FragColor.a < 0.5)',
                //     'discard;',
            '}'
        ].join("\n")
    });

    return basic;
});
