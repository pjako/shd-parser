const shd = `//------------------------------------------------------------------------------
//  triangle.shd
//  Annotated GLSL shaders for Triangle sample.
//------------------------------------------------------------------------------
@vs vs
@in vec4 position
@in vec4 color0
@out vec4 color
    _position = position;
    color = color0;
@end

@fs fs
@in vec4 color
    _color = color;
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