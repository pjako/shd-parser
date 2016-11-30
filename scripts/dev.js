// imports fs
const fs = require('fs');
const path = require('path');
// imports webpack
const shdLoader = require('../lib/webpack-loader.js');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const genDefaultWebpack = require('../default.webpack.js');

// helper
function directoryExists(url) {
    try {
        return fs.lstatSync(url).isDirectory();
    } catch(e) { }
    return false;
}
function fileExists(url) {
    try {
        return fs.lstatSync(url).isFile();
    } catch(e) { }
    return false;
}

// program
const program = (process.argv.filter(val => val.substring(0, 2) === '--')[0] || '').substring(2);
if (!program) {
    console.error(`Program argument missing f.E. '--trinagle'`);
    process.exit();
}
const programPath = `./web/${program}/`;
const scriptPath = `${programPath}${program}.ts`;
const htmlPath = `${programPath}index.html`;

if (!directoryExists(programPath)) {
    throw new Error(`Program '${program}', does not exist at '${programPath}'`);
}
if (!fileExists(scriptPath)) {
    throw new Error(`Entry typescript file '${scriptPath}' is missing`);
}
if (!fileExists(htmlPath)) {
    throw new Error(`Entry html file '${htmlPath}' is missing`);
}
const config = genDefaultWebpack();
config.entry = scriptPath;
config.output.publicPath = programPath;
config.output.path = path.resolve(__dirname, programPath);
config.output.filename = `${program}.js`;
console.log(`Run Program '${program}'`);
console.log(`Open: http://127.0.0.1:8080/webpack-dev-server/`);
var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {
    contentBase: programPath,
    hot: false,
    quiet: false,
    stats: {
        colors: true
    },
    watchOptions: {
        aggregateTimeout: 500,
        poll: true
    }
});
server.listen(8080);