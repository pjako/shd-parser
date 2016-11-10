const GL = WebGLRenderingContext;
/**
 * buffer and texture data usage hint
 */
export enum Usage {
    /** data is immutable, cannot be modified after creation */
    Immutable = GL.STATIC_DRAW,
    /** data is updated infrequently */
    Dynamic = GL.DYNAMIC_DRAW,
    /** data is overwritten each frame */
    Stream = GL.STREAM_DRAW,
}

export class Buffer {
    readonly gl: WebGLRenderingContext;
    readonly buffer: WebGLBuffer;
    readonly bindTarget: number;
    readonly bindingParam: number;
    constructor(gl: WebGLRenderingContext, name: string, bindTarget: number, bindingParam: number) {
        this.gl = gl;
        this.buffer = gl.createBuffer();
        this.bindTarget = bindTarget;
        this.bindingParam = bindingParam;
    }
    uploadData(data: Float32Array, usage: Usage) {
        console.error('Not implemented yet.');
        return this;
    }
}

export class IndexBuffer extends Buffer {
    constructor(gl: WebGLRenderingContext, name: string) {
        super(gl, name, gl.ELEMENT_ARRAY_BUFFER, gl.ELEMENT_ARRAY_BUFFER_BINDING);
    }
}

export class VertexBuffer extends Buffer {
    constructor(gl: WebGLRenderingContext, name: string) {
        super(gl, name, gl.ARRAY_BUFFER, gl.ARRAY_BUFFER_BINDING);
    }
}