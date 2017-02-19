define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    require('./Model.js');
    require('./Face.js');
    require('./../../Utils/TextureLoader.js');

    Kings.ObjLoader = {
        loadMtl: function(input, path, callback) {
            var lines = input.split(/\r?\n/);
            var materials = [];
            var onQueue = 0;
            var done = 0;
            for (var i = 0; i < lines.length; i++) {
                if(lines[i].charAt(0) != '#'){
                    var data = lines[i].split(' ');
                    switch (data[0]) {
                        case 'map_Kd': {
                            (function(){
                                var num = onQueue;
                                Kings.Texture.loadTexture(path + data[1], function(texture) {
                                    materials[num].texture = texture;
                                    done++;
                                    if (done == onQueue) {
                                        callback(materials);
                                    }
                                });
                            }());
                            onQueue++;
                            break;
                        }
                        case 'newmtl': {
                            (function(){
                                materials.push({
                                    name: data[1]
                                });
                            }());
                            break;
                        }
                    }
                }
            }
        },

        loadObj: function(input, materials, mainMesh, callback) {
            var lines = input.split(/\r?\n/);
            var step = 'start';
            var groups = [];
            groups.push({
                faces: [],
                texture: null
            });
            var vertex = [];
            var normals = [];
            var textureCoords = [];
            for (var i = 0; i < lines.length; i++) {
                var data = lines[i].split(' ');
                (function(){
                    switch (data[0]) {
                        case 'usemtl': {
                            for (var j = 0; j < materials.length; j++) {
                                if (materials[j].name == data[1]) {
                                    groups[groups.length - 1].texture = materials[j].texture;
                                }
                            }
                            break;
                        }
                        case 'o': {
                            if (step != 'start') {
                                groups.push({
                                    faces: [],
                                    texture: null
                                });
                                step = 'start';
                            }
                            groups[groups.length - 1].name = data[1];
                            break;
                        }
                        case 'v': {
                            vertex.push(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
                            break;
                        }
                        case 'vt': {
                            textureCoords.push(parseFloat(data[1]), parseFloat(data[2]));
                            break;
                        }
                        case 'vn': {
                            normals.push(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
                            break;
                        }
                        case 'f': {
                            step = 'end';
                            var v = [];
                            var t = [];
                            var n = [];
                            for (var k = 1; k < data.length; k++) {
                                var indices = data[k].split('/');
                                v.push(parseFloat(indices[0]));
                                t.push(parseFloat(indices[1]));
                                n.push(parseFloat(indices[2]));
                            }
                            groups[groups.length - 1].faces.push(new Kings.Face({
                                vertex: v,
                                normal: n,
                                textureCoord: t
                            }));
                            break;
                        }
                    }
                }());
            }
            for (var i = 0; i < groups.length; i++) {
                var v = [];
                var t = [];
                var n = [];
                for (var j = 0; j < groups[i].faces.length; j++) {
                    v.push(
                        vertex[((groups[i].faces[j].vertex[0] - 1) * 3) + 0],
                        vertex[((groups[i].faces[j].vertex[0] - 1) * 3) + 1],
                        vertex[((groups[i].faces[j].vertex[0] - 1) * 3) + 2],

                        vertex[((groups[i].faces[j].vertex[1] - 1) * 3) + 0],
                        vertex[((groups[i].faces[j].vertex[1] - 1) * 3) + 1],
                        vertex[((groups[i].faces[j].vertex[1] - 1) * 3) + 2],

                        vertex[((groups[i].faces[j].vertex[2] - 1) * 3) + 0],
                        vertex[((groups[i].faces[j].vertex[2] - 1) * 3) + 1],
                        vertex[((groups[i].faces[j].vertex[2] - 1) * 3) + 2]
                    );
                    n.push(
                        normals[((groups[i].faces[j].normal[0] - 1) * 3) + 0],
                        normals[((groups[i].faces[j].normal[0] - 1) * 3) + 1],
                        normals[((groups[i].faces[j].normal[0] - 1) * 3) + 2],

                        normals[((groups[i].faces[j].normal[1] - 1) * 3) + 0],
                        normals[((groups[i].faces[j].normal[1] - 1) * 3) + 1],
                        normals[((groups[i].faces[j].normal[1] - 1) * 3) + 2],

                        normals[((groups[i].faces[j].normal[2] - 1) * 3) + 0],
                        normals[((groups[i].faces[j].normal[2] - 1) * 3) + 1],
                        normals[((groups[i].faces[j].normal[2] - 1) * 3) + 2]
                    );
                    t.push(
                        textureCoords[((groups[i].faces[j].textureCoord[0] - 1) * 2) + 0],
                        textureCoords[((groups[i].faces[j].textureCoord[0] - 1) * 2) + 1],

                        textureCoords[((groups[i].faces[j].textureCoord[1] - 1) * 2) + 0],
                        textureCoords[((groups[i].faces[j].textureCoord[1] - 1) * 2) + 1],

                        textureCoords[((groups[i].faces[j].textureCoord[2] - 1) * 2) + 0],
                        textureCoords[((groups[i].faces[j].textureCoord[2] - 1) * 2) + 1]
                    );
                }
                groups[i].vertex = v;
                groups[i].normals = n;
                groups[i].textureCoords = t;
            }
            if (mainMesh != null) {
                var index = 0;
                for (var i = 0; i < groups.length; i++) {
                    if (groups[i].name == mainMesh) {
                        index = i;
                    }
                }
                if (index != 0) {
                    var g = [];
                    for (var i = 0; i < groups.length; i++) {
                        if (i != index) {
                            g.push(new Kings.Model({
                                vertices: groups[i].vertex,
                                textureCoords: groups[i].textureCoords,
                                vertexNormals: groups[i].normals,
                                texture: groups[i].texture,
                                name: groups[i].name,
                            }));
                        }
                    }
                    var model = new Kings.Model({
                        vertices: groups[index].vertex,
                        textureCoords: groups[index].textureCoords,
                        vertexNormals: groups[index].normals,
                        texture: groups[index].texture,
                        name: groups[index].name,
                        groups: g
                    });
                    callback(model);
                } else {
                    callback(null);
                }
            } else {
                var g = [];
                for (var i = 1; i < groups.length; i++) {
                    g.push(new Kings.Model({
                        vertices: groups[i].vertex,
                        textureCoords: groups[i].textureCoords,
                        vertexNormals: groups[i].normals,
                        texture: groups[i].texture,
                        name: groups[i].name,
                    }));
                }
                var model = new Kings.Model({
                    vertices: groups[0].vertex,
                    textureCoords: groups[0].textureCoords,
                    vertexNormals: groups[0].normals,
                    texture: groups[0].texture,
                    name: groups[0].name,
                    groups: g
                });
                callback(model);
            }
        }
    };
});
