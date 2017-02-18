define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    require('./../Geometry/Models/ObjLoader.js');
    require('./../Geometry/Models/Model.js');

    Kings.LoadManager = {
        loadBundle: function(name, callback) {
            var self = this;
            this.successCount = 0;
            this.errorCount = 0;
            this.downloadQueue = [];

            $.getJSON("./AssetConfig.json", function(json) {
                var bundle = {};

                var getAssetName = function(path) {
                    var filename = path.replace(/^.*[\\\/]/, '');
                    return filename.replace(/\.[^/.]+$/, "");
                };

                for (var i = 0; i < json.bundles.length; i++) {
                    if(json.bundles[i].name == name) {
                        self.downloadQueue = json.bundles[i].contents;
                    }
                }

                for (var i = 0; i < self.downloadQueue.length; i++) {
                    (function() {
                        var path = json.assetRoot + self.downloadQueue[i];
                        var type = self.getFileExtension(path);
                        switch (type) {
                            case 'png':
                            case 'jpg': {
                                var texture = gl.createTexture();
                                texture.image = new Image();
                                texture.image.addEventListener("load", function() {
                                    self.successCount++;
                                    bundle[getAssetName(path)] = texture;
                                    if (self.isDone()) {
                                        Kings.AssetBundles.push({
                                            name: name,
                                            content: bundle
                                        });
                                        callback();
                                    }
                                }, false);
                                texture.image.addEventListener("error", function() {
                                    self.errorCount++;
                                    if (self.isDone()) {
                                        callback();
                                    }
                                }, false);
                                texture.image.src = path;
                                break;
                            }
                            case 'obj': {
                                var mtlpath = path.substring(0, path.lastIndexOf('/') + 1);
                                var completePath = mtlpath + getAssetName(path);
                                completePath += '.mtl';
                                self.readTextFile(completePath, function(data) {
                                    Kings.ObjLoader.loadMtl(data, mtlpath, function(materials) {
                                        self.readTextFile(path, function(data) {
                                            Kings.ObjLoader.loadObj(data, materials, getAssetName(path), function(model) {
                                                bundle[getAssetName(path)] = model;
                                                self.successCount++;
                                                console.log('finally');
                                            });
                                        });
                                    });
                                });
                                break;
                            }
                            case 'wav': {
                                break;
                            }
                        }
                    }());
                }
            });
        },

        readTextFile: function(file, callback) {
            var self = this;
            var rawFile = new XMLHttpRequest();
            rawFile.open("GET", file, false);
            rawFile.onreadystatechange = function () {
                if(rawFile.readyState === 4) {
                    if(rawFile.status === 200 || rawFile.status == 0) {
                        callback(rawFile.responseText);
                    }
                }
            }
            rawFile.send(null);
        },

        getFileExtension: function(filename) {
            return filename.substr(filename.lastIndexOf('.')+1);
        },

        isDone: function() {
            return (this.downloadQueue.length == this.successCount + this.errorCount);
        },

        getProgress: function() {
            return (this.successCount + this.errorCount) / this.downloadQueue.length;
        }
    };
});
