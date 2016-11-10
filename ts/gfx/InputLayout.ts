import { Program } from './Program';
import { Mesh } from './Mesh';

export class InputLayout {
    readonly vertexAttributes: VertexAttributes[];
    constructor(gl: WebGLRenderingContext, name: string, progam: Program, mesh: Mesh) {
        const offsets = [];
        const vertexAttributes: VertexAttributes[] = [];
        attrOptions.forEach(attr => {
            const name = attr.name;
            const programInput = progam.attributes[name];
            if (!programInput) {
                return;
            }
            const slot = attr.slot;
            const location = programInput.location;
            const type = programInput.type;
            const size = programInput.size;
            const stride = attr.stride !== void 0 ? attr.stride : size;
            const offset = attr.offset !== void 0 ? attr.offset : Number(offsets[attr.slot]);
            const index = programInput.index;
            offsets[slot] = offset + stride;
            vertexAttributes.push({ name, index, location, stride, offset, type, size, slot });
        });
        this.vertexAttributes = vertexAttributes;
    }
}

export interface VertexAttributes {
    name: string;
    location: number;
    index: number;
    stride: number;
    offset: number;
    size: number;
    type: number;
    slot: number;
}