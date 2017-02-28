define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    var crt = new Kings.Shader({
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
            '#ifdef GL_ES',
            '#define LOWP lowp',
                'precision mediump float;',
            '#else',
                '#define LOWP',
            '#endif',
            '#define CRT_CASE_BORDR 0.0125',
            '#define SCAN_LINE_MULT 1250.0',
            'float CRT_CURVE_AMNTx = 0.7; // curve amount on x',
            'float CRT_CURVE_AMNTy = 1.0; // curve amount on y',
            'varying LOWP vec4 v_color;',
            'varying vec2 vTextureCoord;',
            'uniform sampler2D uSampler;',
            'void main() {',
            	'vec2 tc = vec2(vTextureCoord.x, vTextureCoord.y);',
            	'float dx = abs(0.5-tc.x);',
            	'float dy = abs(0.5-tc.y);',
            	'dx *= dx;',
            	'dy *= dy;',
            	'tc.x -= 0.5;',
            	'tc.x *= 1.0 + (dy * CRT_CURVE_AMNTx);',
            	'tc.x += 0.5;',
            	'tc.y -= 0.5;',
            	'tc.y *= 1.0 + (dx * CRT_CURVE_AMNTy);',
            	'tc.y += 0.5;',
            	'vec4 cta = texture2D(uSampler, vec2(tc.x, tc.y));',
            	'cta.rgb += sin(tc.y * SCAN_LINE_MULT) * 0.02;',
            	'if(tc.y > 1.0 || tc.x < 0.0 || tc.x > 1.0 || tc.y < 0.0)',
            		'cta = vec4(0.0);',
            	'gl_FragColor = cta;',
            '}'
        ].join("\n")
    });

    return crt;
});
