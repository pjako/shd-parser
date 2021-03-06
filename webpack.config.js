module.exports = {
    entry: './web/triangle/triangle.ts',
    resolve: {
        extensions: ['', '.ts', '.shd']
    },
    context: path.resolve(__dirname),
    output: {
        path: './web/triangle/',
        filename: 'triangle.js'
    },
    module: {
        loaders: [
            { test: /\.shd$/, loader: '../../lib/webpack-loader.js' },
            { test: /\.ts$/, loader: "ts-loader" }
        ]
    }
};