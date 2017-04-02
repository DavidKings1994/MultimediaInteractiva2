var webpack = require('webpack');
module.exports = {
    entry: {
        main: __dirname + "/js/main.js"
    },
    output: {
        path: __dirname + "/js/dist/",
        publicPath: __dirname + "/Assets/",
        filename: "[name].bundle.js",
        chunkFilename: "[id].bundle.js"
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jquery: 'jquery',
            'window.jQuery': 'jquery',
            jQuery: 'jquery'
        })
    ],
    resolve: {
        alias: {
            'jquery': __dirname + '/node_modules/jquery/dist/jquery.js',
            'vue':  __dirname + '/node_modules/vue/dist/vue.common.js',
            'glMatrix': __dirname + '/node_modules/gl-matrix/dist/gl-matrix.js',
            'vue-loader': __dirname + '/node_modules/vue-loader/lib/loader.js',
            'vuex':  __dirname + '/node_modules/vuex/dist/vuex.js',
        }
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.vue$/, loader: "vue-loader" },
            { test: /\.(png|jpg)$/, loader: 'file-loader' }
        ]
    }
};
