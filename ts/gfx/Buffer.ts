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

/**
 * Vertex index formats.
 */
export enum IndexFormat {
    /** no vertex indices */
    None = WebGLRenderingContext.NONE,
    /** 16-bit indices */
    UShort = WebGLRenderingContext.UNSIGNED_SHORT,
    /** 32-bit indices */
    UInt = WebGLRenderingContext.UNSIGNED_INT,
}

export class Buffer {
    readonly gl: WebGLRenderingContext;
    readonly name: string;
    readonly buffer: WebGLBuffer;
    readonly bindTarget: number;
    readonly bindingParam: number;
    private _size: number = 0;
    get size(): number {
        return this._size;
    }
    constructor(gl: WebGLRenderingContext, name: string, bindTarget: number, bindingParam: number) {
        this.gl = gl;
        this.name = name;
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
    allocate(size: number, usage: Usage) {
        const { gl } = this;
        const oldBindTarget = gl.getParameter(this.bindingParam);
        gl.bindBuffer(this.bindTarget, this.buffer);
        this.gl.bufferData(this.bindTarget, size, usage);
        gl.bindBuffer(this.bindTarget, oldBindTarget);
        this._size = size;
        return this;
    }
}

export class IndexBuffer extends Buffer {
    readonly indexFormat: IndexFormat;
    constructor(gl: WebGLRenderingContext, name: string, bufferData) {
        super(gl, name, gl.ELEMENT_ARRAY_BUFFER, gl.ELEMENT_ARRAY_BUFFER_BINDING);
        if (bufferData) {
            let { data, usage, size, indexFormat } = bufferData;
            this.indexFormat = indexFormat;
            const ArrayTypeConstructor = indexFormat === IndexFormat.UInt ? Uint32Array : Uint16Array;
            if (typeof usage !== 'number') {
                usage = usage === undefined ? Usage.Immutable : Usage[usage];
            }
            if (data) {
                this.uploadData(data instanceof ArrayTypeConstructor ? data : new ArrayTypeConstructor(data), usage);
            } else if (typeof size === 'number') {
                this.allocate(size, usage);
            }
        }
    }
}

export class VertexBuffer extends Buffer {
    constructor(gl: WebGLRenderingContext, name: string, bufferData) {
        super(gl, name, gl.ARRAY_BUFFER, gl.ARRAY_BUFFER_BINDING);
        if (bufferData) {
            let { data, usage, size } = bufferData;
            if (typeof usage !== 'number') {
                usage = usage === undefined ? Usage.Immutable : Usage[usage];
            }
            if (data) {
                this.uploadData(data instanceof Float32Array ? data : new Float32Array(data), usage);
            } else if (typeof size === 'number') {
                this.allocate(size, usage);
            }
        }
    }
}