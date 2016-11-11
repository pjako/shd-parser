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
    private _size: number = 0;
    get size(): number {
        return this._size;
    }
    constructor(gl: WebGLRenderingContext, name: string, bindTarget: number, bindingParam: number) {
        this.gl = gl;
        this.buffer = gl.createBuffer();
        this.bindTarget = bindTarget;
        this.bindingParam = bindingParam;
    }
    uploadData(data: ArrayBufferView, usage: Usage) {
        const { gl } = this;
        const oldBindTarget = gl.getParameter(this.bindingParam);
        gl.bindBuffer(this.bindTarget, this.buffer);
        gl.bufferData(this.bindTarget, data, usage);
        this._size = data.byteLength;
        gl.bindBuffer(this.bindTarget, oldBindTarget);
        return this;
    }
    uploadSubData(data: ArrayBufferView, offset:number) {
        const { gl } = this;
        if (offset + data.byteLength > this._size) {
            throw new Error(`Data is too large ${offset + data.byteLength} > ${this._size}`);
        }
        const oldBindTarget = gl.getParameter(this.bindingParam);
        gl.bindBuffer(this.bindTarget, this.buffer);
        gl.bufferSubData(this.bindTarget, offset, data);
        this._size = data.byteLength;
        gl.bindBuffer(this.bindTarget, oldBindTarget);
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