import { IndexBuffer, VertexBuffer } from './Buffer';
export class Mesh {
    readonly primitiveType: PrimitiveType;
    readonly vertexBuffers: VertexBuffer[];
    readonly indexBuffer?: IndexBuffer;
    readonly indexFormat?: IndexFormat;
    readonly indexSize?: number;
    readonly meshAttributes?: MeshAttribute[];
}

/**
 * 3D primitive types.
 */
export enum PrimitiveType {
    /** point list */
    Points = WebGLRenderingContext.POINTS,
    /** line list */
    Lines = WebGLRenderingContext.LINES,
    /** line strip */
    LineStrip = WebGLRenderingContext.LINE_STRIP,
    /** triangle list */
    Triangles = WebGLRenderingContext.TRIANGLES,
    /** triangle strip */
    TriangleStrip = WebGLRenderingContext.TRIANGLE_STRIP,
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

export interface MeshAttribute {
    name: string;
    stride: number;
    offset: number;
    size: number;
    type: number;
    slot: number;
}
