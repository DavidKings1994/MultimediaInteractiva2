module.exports = {
    entry: {
        main: __dirname + "/main.js"
    },
    output: {
        path: __dirname + "/dist/",
        filename: "[name].bundle.js",
        chunkFilename: "[id].bundle.js"
    },
    resolve: {
        alias: {
            'jquery': __dirname + '/../node_modules/jquery/dist/jquery.js',
            'vue':  __dirname + '/../node_modules/vue/dist/vue.common.js',
            'glMatrix': __dirname + '/../node_modules/gl-matrix/dist/gl-matrix.js'
        }
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }
};
