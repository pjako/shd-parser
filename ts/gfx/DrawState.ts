import {Pipeline} from './Pipeline';
import {Mesh} from './Mesh';
import {Texture} from './Texture';
import {InputLayout} from './InputLayout';

export class DrawState {
    readonly name: string;
    readonly pipeline: Pipeline;
    readonly mesh: Mesh;
    readonly textures: Texture[];
    readonly inputLayout: InputLayout;

    constructor(name: string, pipeline: Pipeline, mesh: Mesh, textures: Texture[], inputLayout?: InputLayout) {
        this.pipeline = pipeline;
        this.mesh = mesh;
        this.textures = textures;
        this.inputLayout = inputLayout || new InputLayout();
    }
}