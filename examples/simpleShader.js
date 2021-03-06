const shd = `
//------------------------------------------------------------------------------
//  triangle.shd
//  Simple Shader for flat & colored Triangle
//------------------------------------------------------------------------------

@uniformBlock matricies Matricies
    mat4 modelViewMatrix ModelViewMatrix
    mat4 perspectiveMatrix PerspectiveMatrix
@end

@textureBlock sampler Sampler
    sampler2D textureSampler TextureSampler linear linear linear linear 1
@end

@vs texturedObjectVS
@option something +1 20 no true false
@useUniformBlock matricies
@in vec3 position
@in vec2 texcoord0
@out vec2 uv0
    _position = perspectiveMatrix * modelViewMatrix * vec4(position, 1.0);
    uv0 = texcoord0;
@end

@fs texturedObjectFS
@useTextureBlock sampler
@in vec2 uv0
    _color = texture2D(textureSampler, vec2(uv0.s, uv0.t));
@end

@program Simple texturedObjectVS texturedObjectFS
`;

const shdParserGenerator = require('../lib/shdParserGenerator');
const shaderLib = shdParserGenerator([shd]);
console.log('done');
console.log(shaderLib.programs.Simple);
console.log(shaderLib.vertexShaders.texturedObjectVS.inputs);