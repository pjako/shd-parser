/**
 * This is a webpack loader that compiles the raw shader/programdata ect. into javascript
 */
const shdParserGenerator = require('../lib/shdParserGenerator');
const shaderVersion = 'glsl100';
const path = require('path');
const genAttrOrUniform = (attrOrUniform, index) => `{name: ${attrOrUniform.name}, type: '${attrOrUniform.type}'}`;

function stringifyInput(input) {
    return `{name: '${input.name}', type: '${input.type}'}`;
}

module.exports = function(source) {
    const shaderLib = shdParserGenerator([source], importStr => {
        // handle import
    });
    let lines = [];
    lines.push('var o = {};');
    lines.push('module.exports = o;');
    lines.push(`o.programs = {`);
    lines = lines.concat(Object.keys(shaderLib.programs).map(key => `  ${key}: {vs: '${shaderLib.programs[key].vs}',fs: '${shaderLib.programs[key].fs}'},`));
    lines.push(`};`);
    lines.push(`o.vertexShaders = {`);
    lines.push(Object.keys(shaderLib.vertexShaders)
        .map(key => `  ${key}: {source: '${shaderLib.vertexShaders[key].optimizedSource[shaderVersion].replace(/\n/g, '\\n')}', inputs: [${shaderLib.vertexShaders[key].inputs.map(stringifyInput).join(', ')}]}`).join(',\n'));
    lines.push(`};`);
    lines.push(`o.fragmentShaders = {`);
    lines.push(Object.keys(shaderLib.fragmentShaders)
        .map(key => `  ${key}: {source: '${shaderLib.fragmentShaders[key].optimizedSource[shaderVersion].replace(/\n/g, '\\n')}' }`).join(',\n'));
    lines.push(`};`);
    return lines.join('\n');
};