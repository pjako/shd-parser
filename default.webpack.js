const path = require('path');
module.exports = () => ({
    entry: '',
    resolve: {
        extensions: ['', '.ts', '.shd']
    },
    context: path.resolve(__dirname),
    output: {},
    module: {
        loaders: [
            { test: /\.shd$/, loader: '../../lib/webpack-loader.js' },
            { test: /\.ts$/, loader: "ts-loader" }
        ]
    }
});