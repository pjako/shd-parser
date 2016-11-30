import { IndexBuffer, VertexBuffer, IndexFormat } from './Buffer';

export interface MeshAttribute {
    readonly name: string;
    readonly stride?: number;
    readonly offset?: number;
    readonly size?: number;
    readonly type?: number;
    readonly normalize?: boolean;
    readonly slot: number;
}

export class Mesh {
    readonly name: string;
    readonly primitiveType: PrimitiveType;
    readonly vertexBuffers: VertexBuffer[];
    readonly indexBuffer?: IndexBuffer;
    get indexFormat() {
        return !this.indexBuffer ? IndexFormat.None : this.indexBuffer.indexFormat;
    }
    readonly indexSize?: number;
    readonly meshAttributes?: MeshAttribute[] = [];
    constructor(gl: WebGLRenderingContext, name:string, vertexBuffers, indexBuffer, primitiveType = PrimitiveType.Triangles) {
        this.primitiveType = primitiveType;
        this.vertexBuffers = vertexBuffers.map( (vb, slot) => {
            vb.attributes.forEach((attr) => this.meshAttributes.push({
                name: attr.name || attr,
                offset: attr.offset,
                size: attr.size,
                type: attr.type,
                stride: attr.stride,
                slot: slot,
            }));
            return new VertexBuffer(gl, vb.name, vb);
        });
        if (indexBuffer) {
            this.indexBuffer = new IndexBuffer(gl, indexBuffer.name, indexBuffer);
        }
    }
}
const GL = WebGLRenderingContext;
/**
 * 3D primitive types.
 */
export enum PrimitiveType {
    /** point list */
    Points = GL.POINTS,
    /** line list */
    Lines = GL.LINES,
    /** line strip */
    LineStrip = GL.LINE_STRIP,
    /** triangle list */
    Triangles = GL.TRIANGLES,
    /** triangle strip */
    TriangleStrip = GL.TRIANGLE_STRIP,
}