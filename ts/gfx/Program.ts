export class Program {
    readonly gl: WebGLRenderingContext;
    readonly vertexShader: VertexShader;
    readonly fragmentShader: FragmentShader;
    readonly program: WebGLProgram;
    readonly attributes: { [code: string]: Attribute; };
    constructor(gl, name, vs, fs) {
        const prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            console.error('Failed to link shader program!');
        }
        this.vertexShader = vs;
        this.fragmentShader = fs;
        this.gl = gl;
        this.program = prog;
        const attributes: { [code: string]: Attribute; } = {};
        const numActiveAttributes: number = gl.getProgramParameter(prog, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; numActiveAttributes >= i; i++) {
            const activeAttribute: WebGLActiveInfo = gl.getActiveAttrib(prog, i);
            attributes[activeAttribute.name] = {
                name: activeAttribute.name,
                size: activeAttribute.size,
                type: activeAttribute.type,
                location: gl.getAttribLocation(prog, activeAttribute.name)
            };
        }
        this.attributes = attributes;

    }
}

export interface Attribute {
    name:string;
    size:number;
    type:number;
    location:number;
}

export abstract class Shader {
    shader: WebGLShader;
    constructor(gl: WebGLRenderingContext, name, source, type) {
        const sh = gl.createShader(type);
        gl.shaderSource(sh, source);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
            console.error('Failed to compile shader:\n' + gl.getShaderInfoLog(sh));
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