
'use strict';
let webpack = require('webpack');
let path = require('path');

let ENTRY = {
    'bundle': path.join(__dirname, 'boot.js'),
    // 'prefix': path.join(__dirname, 'prefix.js')
}
let OUTPUT = path.join(__dirname, 'product');
let externals = _externals();

module.exports = {
    entry:ENTRY,
    target: 'node',
    output: {
        path:OUTPUT,
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js']
    },
    externals: externals,
    node: {
        console: true,
        global: true,
        process: true,
        Buffer: true,
        __filename: true,
        __dirname: true,
        setImmediate: true
    },
    module: {
        loaders: [
            {
                test: /.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015','stage-0']
                },
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
};

function _externals() {
    let manifest = require('./package.json');
    let dependencies = manifest.dependencies;
    let externals = {};
    for (let p in dependencies) {
        externals[p] = 'commonjs ' + p;
    }
    return externals;
}