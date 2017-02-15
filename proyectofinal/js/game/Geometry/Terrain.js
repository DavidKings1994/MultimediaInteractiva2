define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    require('./../Utils/TextureLoader.js');
    require('./../Processing/PerlinNoise.js');
    require('./../Processing/Utils.js');
    require('./Grid.js');

    Kings.Terrain = function(parameters) {
        Kings.Grid.call(this, parameters);
        this.zValues = [];
        this.zPosition = 0;
    };

    Kings.Terrain.prototype = Object.create(Kings.Grid.prototype);

    Kings.Terrain.prototype.constructor = Kings.Terrain;

    Kings.Terrain.prototype.update = function() {
        var yoff = 0;
        for (var y = 0; y < this.rows+1; y++) {
            this.zValues[y] = [];
            var xoff = this.zPosition;
            for (var x = 0; x < this.cols+1; x++) {
                this.zValues[y][x] = Kings.Processing.map(Kings.PerlinNoise.noise( xoff, yoff, .8 ), 0, 1, 0, 7);
                xoff += 0.35;
            }
            yoff += 0.35;
        }
        this.zPosition += 0.02;

        var stepx = this.width / this.cols;
        var stepy = this.height / this.rows;
        this.gridVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.gridVertexPositionBuffer);
        var vertices = [];
        for (var y = 0; y < this.rows; y++) {
            for (var x = 0; x < this.cols; x++) {
                vertices = vertices.concat([
                    (0 - (this.width / 2)) + ((x * stepx) + 0), (0 - (this.height / 2)) + ((y * stepy) + 0), 0 + this.zValues[x][y],
                    (0 - (this.width / 2)) + ((x * stepx) + stepx), (0 - (this.height / 2)) + ((y * stepy) + 0), 0 + this.zValues[x+1][y],
                    (0 - (this.width / 2)) + ((x * stepx) + 0), (0 - (this.height / 2)) + ((y * stepy) + stepy), 0 + this.zValues[x][y+1],

                    (0 - (this.width / 2)) + ((x * stepx) + stepx), (0 - (this.height / 2)) + ((y * stepy) + 0), 0 + this.zValues[x+1][y],
                    (0 - (this.width / 2)) + ((x * stepx) + stepx), (0 - (this.height / 2)) + ((y * stepy) + stepy), 0 + this.zValues[x+1][y+1],
                    (0 - (this.width / 2)) + ((x * stepx) + 0), (0 - (this.height / 2)) + ((y * stepy) + stepy), 0 + this.zValues[x][y+1],
                ]);
            }
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        this.gridVertexPositionBuffer.itemSize = 3;
        this.gridVertexPositionBuffer.numItems = 6 * (this.cols * this.rows);
    };
});
