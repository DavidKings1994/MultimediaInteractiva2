define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    var grayscale = new Kings.Shader({
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
                'float average = (textureColor.r + textureColor.g + textureColor.b) / 3.0;',
                'gl_FragColor = vec4(average, average, average, textureColor.a);',
            '}'
        ].join("\n")
    });

    return grayscale;
});
