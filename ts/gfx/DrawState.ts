import {Pipeline} from './Pipeline';
import {Mesh} from './Mesh';
import {Texture} from './Texture';
import {SamplerState} from './SamplerState';
import {InputLayout} from './InputLayout';
import {GraphicsContext} from './GraphicsContext';

interface Sampler {
    readonly texture: Texture;
    readonly state: SamplerState
}

export class DrawState {
    readonly name: string;
    readonly context: GraphicsContext;
    readonly pipeline: Pipeline;
    readonly mesh: Mesh;
    readonly textures: { [code: string]: Texture; };
    readonly samplers: Sampler[] = [];
    readonly inputLayout: InputLayout;
    private _isInitialized: boolean = false;
    get isInitialized(): boolean {
        return this._isInitialized;
    }

    constructor(name: string, context:GraphicsContext, pipeline: Pipeline, mesh: Mesh, textures: { [code: string]: Texture; }, inputLayout?: InputLayout) {
        this.context = context;
        this.pipeline = pipeline;
        this.mesh = mesh;
        this.inputLayout = inputLayout || new InputLayout();
        this.textures = textures;
    }

    initialize() {
        if (this._isInitialized) {
            return;
        }
        this._isInitialized = true;
        const textures = this.textures;
        const { samplers, samplerStates} = this.pipeline.program;
        samplers.forEach(sampler => {
            this.samplers.push({
                texture: textures[sampler.name],
                state: samplerStates[sampler.name]
            });
        });
    }
}