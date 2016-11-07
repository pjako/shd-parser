const shdLoader = require('./lib/webpack-loader.js');
module.exports = {
    entry: './web/triangle.ts',
    output: {
        path: './web/',
        filename: 'triangle.js'
    },
    module: {
        loaders: [
            { test: /\.shd$/, loader: '../lib/webpack-loader.js' },
            { test: /\.ts$/, loader: "ts-loader" }
        ]
    }
};