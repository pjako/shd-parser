const GL = WebGLRenderingContext;

class ProgramSampler {
    readonly name: string;
    readonly index: number;
    readonly type: number;
    readonly size: number;
    readonly location: any;
    readonly textureUnit: number;
    constructor(name: string, index: number, type: number, size: number, location, textureUnit: number) {
        this.name = name;
        this.index = index;
        this.type = type;
        this.size = size;
        this.location = location;
        this.textureUnit = textureUnit;
    }
}

class ProgramUniform {
    readonly name: string;
    readonly index: number;
    readonly type: number;
    readonly size: number;
    readonly location: any;
    readonly apply: (gl: WebGLRenderingContext, index: number, argument: any) => void;
    constructor(name: string, index: number, type: number, size: number, location) {
        this.name = name;
        this.index = index;
        this.type = type;
        this.size = size;
        this.location = location;
        this.apply = findUniformSetForType(type);
    }
}

export class Program {
    readonly gl: WebGLRenderingContext;
    readonly vertexShader: VertexShader;
    readonly fragmentShader: FragmentShader;
    readonly program: WebGLProgram;
    private _isInitialized: boolean = false;
    get isInitialized(): boolean {
        return this._isInitialized;
    }
    readonly attributes: { [code: string]: Attribute; } = {};
    readonly samplers: { [code: string]: ProgramSampler; } = {};
    readonly uniforms: { [code: string]: ProgramUniform; } = {};
    constructor(gl: WebGLRenderingContext, name: string, vs: VertexShader, fs: FragmentShader) {
        const prog = this.program = gl.createProgram();
        this.gl = gl;
        gl.attachShader(prog, vs.shader);
        gl.attachShader(prog, fs.shader);
        gl.linkProgram(prog);
        // this.initialize();
    }
    initialize(): void {
        const { gl, program, _isInitialized } = this;
        if (_isInitialized) {
            // already initialized
            return;
        }
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error('Failed to link shader program!');
        }
        this._isInitialized = true;
        // handle attributes
        const { attributes } = this;
        const numActiveAttributes: number = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; numActiveAttributes > i; i++) {
            const activeAttribute: WebGLActiveInfo = gl.getActiveAttrib(program, i);
            attributes[activeAttribute.name] = {
                index: i,
                name: activeAttribute.name,
                size: activeAttribute.size,
                type: activeAttribute.type,
                location: gl.getAttribLocation(program, activeAttribute.name)
            };
        }

        // handle uniforms & samplers
        const numUniforms: number = gl.getProgramParameter(this.program, GL.ACTIVE_UNIFORMS);
        let numSamplers: number = 0;

        if (numUniforms) {
            const oldBindProgram = gl.getParameter(GL.CURRENT_PROGRAM);
            gl.useProgram(this.program);
            for (let i = 0; i < numUniforms; i++) {
                const activeUniform = gl.getActiveUniform(this.program, i);
                const location = gl.getUniformLocation(this.program, activeUniform.name);
                if (isSamplerType(activeUniform.type)) {
                    this.samplers[activeUniform.name.replace('[]', '')] = new ProgramSampler(activeUniform.name, i, activeUniform.type, activeUniform.size, location, numSamplers);
                    gl.uniform1i(location, numSamplers++);
                } else {
                    this.uniforms[activeUniform.name.replace('[]', '')] = new ProgramUniform(activeUniform.name, i, activeUniform.type, activeUniform.size, location);

                }
            }
            gl.useProgram(oldBindProgram);
        }
    }
}

export interface Attribute {
    index: number;
    name: string;
    size: number;
    type: number;
    location: number;
}

export abstract class Shader {
    shader: WebGLShader;
    constructor(gl: WebGLRenderingContext, name, source, type) {
        const sh = gl.createShader(type);
        gl.shaderSource(sh, source);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
            throw new Error('Failed to compile shader:\n' + gl.getShaderInfoLog(sh));
        }
        this.shader = sh;
    }
}

export class VertexShader extends Shader {
    constructor(gl, name, source) {
        super(gl, name, source, gl.VERTEX_SHADER);
    }
}

export class FragmentShader extends Shader {
    constructor(gl, name, source) {
        super(gl, name, source, gl.FRAGMENT_SHADER);
    }
}

const isSamplerType: (type: number) => boolean = type => type === GL.SAMPLER_2D || type == GL.SAMPLER_CUBE;

function setUniform1f(gl, index: number, argument: any): void {
    if (argument instanceof Float32Array) {
        return gl.uniform1fv(index, argument);
    } else if (Array.isArray(argument)) {
        gl.uniform1f(index, argument[0]);
    } else if (typeof argument === 'number') {
        gl.uniform1f(index, argument);
    }
    throw new Error('Argument has invalid type');
}

function setUniform2f(gl: WebGLRenderingContext, index: number, argument: any): void {
    if (argument instanceof Float32Array) {
        return gl.uniform2fv(index, argument);
    } else if (Array.isArray(argument)) {
        return gl.uniform2f(index, argument[0], argument[1]);
    }
    throw new Error('Argument has invalid type');
}

function setUniform3f(gl: WebGLRenderingContext, index: number, argument: any): void {
    if (argument instanceof Float32Array) {
        return gl.uniform3fv(index, argument);
    } else if (Array.isArray(argument)) {
        return gl.uniform3f(index, argument[0], argument[1], argument[2]);
    }
    throw new Error('Argument has invalid type');
}

function setUniform4f(gl: WebGLRenderingContext, index: number, argument: any): void {
    if (argument instanceof Float32Array) {
        return gl.uniform4fv(index, argument);
    } else if (Array.isArray(argument)) {
        return gl.uniform4f(index, argument[0], argument[1], argument[2], argument[3]);
    }
    throw new Error('Argument has invalid type');
}

function setUniform1i(gl: WebGLRenderingContext, index: number, argument: any): void {
    if (argument instanceof Int32Array) {
        return gl.uniform1iv(index, argument);
    } else if (Array.isArray(argument)) {
        return gl.uniform1i(index, argument[0]);
    } else if (typeof argument === 'number') {
        return gl.uniform1i(index, argument);
    }
    throw new Error('Argument has invalid type');
}

function setUniform2i(gl: WebGLRenderingContext, index: number, argument: any): void {
    if (argument instanceof Int32Array) {
        return gl.uniform2iv(index, argument);
    } else if (Array.isArray(argument)) {
        return gl.uniform2i(index, argument[0], argument[1]);
    }
    throw new Error('Argument has invalid type');
}

function setUniform3i(gl: WebGLRenderingContext, index: number, argument: any): void {
    if (argument instanceof Int32Array) {
        return gl.uniform3iv(index, argument);
    } else if (Array.isArray(argument)) {
        return gl.uniform3i(index, argument[0], argument[1], argument[2]);
    }
    throw new Error('Argument has invalid type');
}

function setUniform4i(gl: WebGLRenderingContext, index: number, argument: any): void {
    if (argument instanceof Int32Array) {
        return gl.uniform4iv(index, argument);
    } else if (Array.isArray(argument)) {
        return gl.uniform4i(index, argument[0], argument[1], argument[2], argument[3]);
    }
    throw new Error('Argument has invalid type');
}

function setUniformMatrix2(gl: WebGLRenderingContext, index: number, argument: any): void {
    if (argument instanceof Float32Array) {
        return gl.uniformMatrix2fv(index, false, argument);
    }
    throw new Error('Argument has invalid type');
}

function setUniformMatrix3(gl: WebGLRenderingContext, index: number, argument: any): void {
    if (argument instanceof Float32Array) {
        return gl.uniformMatrix3fv(index, false, argument);
    }
    throw new Error('Argument has invalid type');
}

function setUniformMatrix4(gl: WebGLRenderingContext, index: number, argument: any): void {
    if (argument instanceof Float32Array) {
        return gl.uniformMatrix4fv(index, false, argument);
    }
    throw new Error('Argument has invalid type');
}

function findUniformSetForType(type: number): (gl: WebGLRenderingContext, index: number, argument: any) => void {
    switch (type) {
        case GL.FLOAT:
            return setUniform1f;
        case GL.FLOAT_VEC2:
            return setUniform2f;
        case GL.FLOAT_VEC3:
            return setUniform3f;
        case GL.FLOAT_VEC4:
            return setUniform4f;
        case GL.FLOAT_MAT2:
            return setUniformMatrix2;
        case GL.FLOAT_MAT3:
            return setUniformMatrix3;
        case GL.FLOAT_MAT4:
            return setUniformMatrix4;
        case GL.BOOL:
            return setUniform1i;
        case GL.BOOL_VEC2:
            return setUniform2i;
        case GL.BOOL_VEC3:
            return setUniform3i;
        case GL.BOOL_VEC4:
            return setUniform4i;
        case GL.INT:
            return setUniform1i;
        case GL.INT_VEC2:
            return setUniform2i;
        case GL.INT_VEC3:
            return setUniform3i;
        case GL.INT_VEC4:
            return setUniform4i;
        default:
            throw new Error('Invalid uniform type.');
    }
}