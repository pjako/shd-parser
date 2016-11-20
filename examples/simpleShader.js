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