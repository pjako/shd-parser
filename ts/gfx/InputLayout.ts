import { Program } from './Program';
import { Mesh } from './Mesh';
const GL = WebGLRenderingContext;
export class InputLayout {
    readonly vertexAttributes: VertexAttributes[] = [];
    private _isInitialized: boolean = false;
    get isInitialized(): boolean {
        return this._isInitialized;
    }
    initialize(mesh: Mesh, program: Program) {
        const { vertexAttributes, _isInitialized } = this;
        if (_isInitialized) {
            // already initialized
            return;
        }
        this._isInitialized = true;
        const { meshAttributes } = mesh;
        vertexAttributes.length = 0;
        if (meshAttributes.length === 0) {
            throw new Error('You need to define the Attributes of your mesh');
        }
        if (meshAttributes[0].stride === void 0) {
            // calculate offset/strides
            const slotStrides = [0, 0, 0, 0, 0, 0];
            const offsets = [];
            for (let idx = 0; meshAttributes.length > idx; idx++) {
                const { name, slot = 0 } = meshAttributes[idx];
                const programInput = program.attributes[name];
                if (!programInput) {
                    throw new Error('Calculating offset/strides is only possible if the used program uses all given attributes.');
                }
                const floatSize = programInput.size * getTypeSize(programInput.type);
                const offset = slotStrides[slot] = slotStrides[slot] || 0;
                offsets.push(offset);
                slotStrides[slot] = floatSize + offset;
            }
            meshAttributes.forEach((attr, idx) => {
                const { name, slot, normalize = false } = attr;
                const programInput = program.attributes[name];
                if (!programInput) {
                    return;
                }
                const { location, index } = programInput;
                const type = GL.FLOAT;
                const size = getTypeSize(programInput.type);
                const offset = offsets[idx] * 4;
                const stride = slotStrides[attr.slot] * 4;
                vertexAttributes.push({ name, index, location, stride, offset, type, size, slot, normalize });
            });
        } else {
            meshAttributes.forEach((attr, idx) => {
                const { name, slot, normalize = false, offset, stride } = attr;
                const programInput = program.attributes[name];
                if (!programInput) {
                    return;
                }
                const { location, type, size, index } = programInput;
                vertexAttributes.push({ name, index, location, stride, offset, type, size, slot, normalize });
            });
        }
    }
}

function getTypeSize(type: number) {
    switch (type) {
        case GL.FLOAT:
            return 1;
        case GL.FLOAT_VEC2:
            return 2;
        case GL.FLOAT_VEC3:
            return 3;
        case GL.FLOAT_VEC4:
        case GL.FLOAT_MAT2:
            return 4;
        case GL.FLOAT_MAT3:
            return 9;
        case GL.FLOAT_MAT4:
            return 16;
    }
    throw new Error('Unknown Attribute type.');
}

export interface VertexAttributes {
    readonly name: string;
    readonly location: number;
    readonly index: number;
    readonly stride: number;
    readonly offset: number;
    readonly size: number;
    readonly type: number;
    readonly slot: number;
    readonly normalize: boolean;
}