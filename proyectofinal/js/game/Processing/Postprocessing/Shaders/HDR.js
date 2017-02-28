define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    var hdr = new Kings.Shader({
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
                'float exposure = 0.5;',
                'const float gamma = 2.2;',
                'vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));',
                'vec3 hdrColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)).rgb;',
                'vec3 mapped = vec3(1.0) - exp(-hdrColor * exposure);',
                'vec3 correction = pow(mapped, vec3(1.0 / gamma));',
                'gl_FragColor = vec4(correction, textureColor.a);',
            '}'
        ].join("\n")
    });

    return hdr;
});
