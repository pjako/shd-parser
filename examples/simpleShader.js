const shd = `//------------------------------------------------------------------------------
//  triangle.shd
//  Simple Shader for flat & colored Triangle
//------------------------------------------------------------------------------
@vs vs
@in vec3 position
@in vec3 color0
@out vec3 color
    _position = vec4(position, 1);
    color = color0;
@end

@fs fs
@in vec3 color
    _color = vec4(color, 1);
@end

@program Triangle vs fs`;

const shdParserGenerator = require('../lib/shdParserGenerator');
const shaderLib = shdParserGenerator([shd]);
console.log(shaderLib.programs.Triangle);
console.log(shaderLib.vertexShaders.vs.inputs);
//console.log(shaderLib.vertexShaders[shaderLib.programs.Triangle.vs]);
//console.log(shaderLib.fragmentShaders[shaderLib.programs.Triangle.fs]);
/*
console.log('Program: ', shaderLib.programs.Shader.name);
console.log('VS');
console.log(shaderLib.vertexShaders[shaderLib.programs.Shader.vs].optimizedSource['glsl120']);
console.log('FS');
console.log(shaderLib.fragmentShaders[shaderLib.programs.Shader.fs].optimizedSource['glsl120']);
*/