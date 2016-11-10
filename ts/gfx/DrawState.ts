import {Pipeline} from './Pipeline';
import {Mesh} from './Mesh';
import {Texture} from './Texture';
import {InputLayout} from './InputLayout';

export class DrawState {
    readonly pipeline: Pipeline;
    readonly mesh: Mesh;
    readonly textures: Texture[];
    readonly inputLayout: InputLayout;

    constructor(pipeline, mesh, inputLayout, textures) {
        this.pipeline = pipeline;
        this.mesh = mesh;
        this.textures = textures;
        this.inputLayout = inputLayout;
    }
}