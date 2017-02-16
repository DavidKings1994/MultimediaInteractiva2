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
        this.zPosition += 0.05;

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

        this.gridVertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.gridVertexNormalBuffer);
        var vertexNormals = [];
        for (var y = 0; y < this.rows; y++) {
            for (var x = 0; x < this.cols; x++) {
                var offset = (((x * y) + x) * 6 * 3);
                var normal1 = Kings.Processing.calculateNormal(
                    [vertices[offset], vertices[offset+1], vertices[offset+2]],
                    [vertices[offset+3], vertices[offset+4], vertices[offset+5]],
                    [vertices[offset+6], vertices[offset+7], vertices[offset+8]]
                );
                var normal2 = Kings.Processing.calculateNormal(
                    [vertices[offset+9], vertices[offset+10], vertices[offset+11]],
                    [vertices[offset+12], vertices[offset+13], vertices[offset+14]],
                    [vertices[offset+15], vertices[offset+16], vertices[offset+17]]
                )
                vertexNormals = vertexNormals.concat([
                    normal1[0], normal1[1], normal1[2],
                    normal1[0], normal1[1], normal1[2],
                    normal1[0], normal1[1], normal1[2],

                    normal2[0], normal2[1], normal2[2],
                    normal2[0], normal2[1], normal2[2],
                    normal2[0], normal2[1], normal2[2],
                ]);
            }
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
        this.gridVertexNormalBuffer.itemSize = 3;
        this.gridVertexNormalBuffer.numItems = 6 * (this.cols * this.rows);
    };
});
