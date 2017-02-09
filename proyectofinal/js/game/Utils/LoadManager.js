define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.LoadManager = {
        loadBundle: function(name, callback) {
            var self = this;
            this.successCount = 0;
            this.errorCount = 0;
            this.downloadQueue = [];

            $.getJSON("./AssetConfig.json", function(json) {
                console.log(json);
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
                    var path = json.assetRoot + self.downloadQueue[i];
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
                }
            });
        },

        isDone: function() {
            return (this.downloadQueue.length == this.successCount + this.errorCount);
        },

        getProgress: function() {
            return (this.successCount + this.errorCount) / this.downloadQueue.length;
        }
    };
});
