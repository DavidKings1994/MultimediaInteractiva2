define(['jquery', 'glMatrix', './../../store/store'],  function($, glMatrix, store) {
    var Kings = window.Kings || {};

    Kings.Score = function(parameters) {
        this.position = parameters.position || { x: 0, y: 0, z: 0 };
        this.score = 0;
        $('#CanvasTemporal').remove();
        var textCanvas = document.createElement('canvas');
        textCanvas.id     = "CanvasTemporal";
        textCanvas.width  = gl.canvas.width;
        textCanvas.height = gl.canvas.height;
        textCanvas.style.zIndex   = 1;
        textCanvas.style.position = "relative";
        textCanvas.style.top = "-100%";
        textCanvas.style.left = "0";
        Kings.canvas.after(textCanvas);
        this.context2D = textCanvas.getContext('2d');
    };

    Kings.Score.prototype = {
        constructor: Kings.Score,

        update: function() {

        },

        draw: function() {
            this.resize();
            this.context2D.clearRect(0, 0, this.context2D.canvas.width, this.context2D.canvas.height);
            this.context2D.font = "60px digital";
            this.context2D.fillStyle = 'green';
            this.context2D.fillText('Km: ' + this.score, this.context2D.canvas.width - 200, 60);
            store.commit('setScore', this.score);
        },

        resize: function() {
            $('#CanvasTemporal').remove();
            var textCanvas = document.createElement('canvas');
            textCanvas.id     = "CanvasTemporal";
            textCanvas.width  = gl.canvas.width;
            textCanvas.height = gl.canvas.height;
            textCanvas.style.zIndex   = 1;
            textCanvas.style.position = "relative";
            textCanvas.style.top = "-100%";
            textCanvas.style.left = "0";
            Kings.canvas.after(textCanvas);
            this.context2D = textCanvas.getContext('2d');
        }
    };
});
