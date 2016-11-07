

function generateJs(shaderLibrary, useOptimized) {
}

function writeProgramSource(program) {
    const lines = [];
    lines.push('{');

    lines.push(`name: ${program.name}`);

    lines.push(`setConstant: function(uniformBlock, uniform, value) {`);
    lines.push(`  const uniformBlock = this.uniformBlock[uniformBlock];`);
    lines.push(`  if (!uniformBlock) throw new Error('UniformBlock does not exist');`);
    lines.push(`  uniformBlock.setConstant(uniform, value)`);
    lines.push(`  uniformBlock.setConstant(uniform, value)`);
    lines.push(`}`);

    lines.push(`applyBufferLayout: function() {`);
    lines.push(`}`);

    return lines.join('\n  ') + '\n}';
}

function writeUniformBlock(uBlock, isWebGL2, typecheck) {
    const lines = [];
    lines.push(`function (program, uniformEnum, value) {`);
    function writeUb(uniform) {
        const lines = [];
        lines.push(`    case(uniforms.${uniform.name}):`);
        if (typecheck) {
            if (uniform.num === 1) {
                if (uBlock.type === 'bool') {
                    lines.push(`if (value !== false || !== true) throw new Error('Uniform needs to be true or false');`);
                } else if (uBlock.type === 'float') {
                    lines.push(`if (typeof value !== 'number') throw new Error('Uniform needs to be a number');`);
                }
            } else {
                lines.push(`if (value.length !== ${uniform.num}) throw new Error('Uniform needs to be an Array of length ${uniform.num}');`);
            }
        }
        if (!isWebGL2) {
            lines.push(`gl.apply(${uniform.bind}, value);`);
        } else {
            // Add WebGL2 Apply
        }
        lines.push(`break;`);
        return lines.join('    \n');
    }
    lines.push(Object.keys(uBlock.uniformsByType).map(writeUb).join('\n'));

    return lines.join('\n') + '}';
}