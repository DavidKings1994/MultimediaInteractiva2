define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.Texture = {
        loadTexture: function(path, callback) {
            var self = this;
            var ready = false;
            var texture = gl.createTexture();
            texture.image = new Image();
            texture.image.addEventListener("load", function() {
                callback(texture);
            }, false);
            texture.image.addEventListener("error", function() {
                callback(texture);
            }, false);
            texture.image.src = path;
        },

        handleTexture: function(texture) {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
    };
});
