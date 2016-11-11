import { Pass, LoadAction, StoreAction, PassOptions } from './Pass.ts';
import { VertexShader, FragmentShader, Program } from './Program.ts';
import { DrawState } from './DrawState.ts';
import { Pipeline } from './Pipeline.ts';
import { PipelineState, applyPipelineState, PipelineStateOptions } from './PipelineState.ts';
import { Buffer, Usage } from './Buffer.ts';
import { Mesh, IndexFormat, PrimitiveType } from './Mesh.ts';

const getTime = typeof performance !== 'undefined' ? () => performance.now() : () => Date.now();
const start = getTime();

const requestFrame = window.requestAnimationFrame || window[['ms', 'moz', 'webkit', 'o']
    .filter(prefix => !!window[prefix + 'RequestAnimationFrame'])[0] + 'RequestAnimationFrame'] || (cb => setTimeout(cb, 16));

const objForEach = (obj, fn: (value: any, key: string) => void): void => Object.keys(obj).forEach(k => fn(obj[k], k));

export class GraphicsContext {
    readonly passes: { [code: string]: Pass; } = {};
    readonly drawStates: { [code: string]: DrawState; } = {};
    readonly vertexShaders: { [code: string]: VertexShader; } = {};
    readonly fragmentShaders: { [code: string]: FragmentShader; } = {};
    readonly programs: { [code: string]: Program; } = {};
    readonly buffers: { [code: string]: Buffer; } = {};
    readonly meshes: { [code: string]: Mesh; } = {};
    readonly pipelines: { [code: string]: Pipeline; } = {};
    readonly pipelineStates: { [code: string]: PipelineState; } = {};
    readonly canvas: HTMLCanvasElement;
    private updateFn: (context: GraphicsContext) => void;
    private nextFrameRequired: boolean = false;
    private frameSheduled: boolean = false;
    private _gl: WebGLRenderingContext;
    private _currentDrawState: DrawState;
    private pipelineStateCache: PipelineStateOptions = { colorWriteMask: [void 0, void 0, void 0, void 0], blendColor: [void 0, void 0, void 0, void 0] };
    get currentDrawState(): DrawState {
        return this._currentDrawState;
    }
    get gl(): WebGLRenderingContext {
        return this._gl;
    }
    get currentTime() {
        return getTime();
    }
    get width(): number {
        return this.canvas.width;
    }
    get height(): number {
        return this.canvas.height;
    }
    constructor({canvas, width, height, alpha = false, depth = true, stencil = false, antiAlias = true, preMultipliedAlpha = true, preserveDrawingBuffer = false, preferLowPowerToHighPerformance = false, highDPI = false, failIfMajorPerformanceCaveat = false}: GraphicsContextOptions) {
        this.canvas = document.querySelector(canvas) as HTMLCanvasElement;
        if (!this.canvas) {
            throw new Error(`There is no CanvasElement named '${canvas}'`);
        }
        this.requireNextFrame();
        const glContextAttrs = {
            alpha, depth, stencil, antialias: antiAlias, premultipliedAlpha: preMultipliedAlpha,
            preserveDrawingBuffer, preferLowPowerToHighPerformance, failIfMajorPerformanceCaveat,
        };
        if (width !== void 0) {
            this.canvas.width = width;
        }
        if (height !== void 0) {
            this.canvas.height = height;
        }
        this._gl = (this.canvas.getContext("webgl", glContextAttrs) || this.canvas.getContext("experimental-webgl", glContextAttrs)) as WebGLRenderingContext;
        this.gl.viewport(0, 0, this.width, this.height);
    }
    private requireNextFrame(): void {
        if (!this.frameSheduled) {
            this.frameSheduled = true;
            requestFrame(() => {
                this.frameSheduled = false;
                this.update();
            });
        }
    }
    private update(): void {
        if (!this.nextFrameRequired) {
            return;
        }
        this.nextFrameRequired = false;
        this.requireNextFrame();
        if (this.updateFn) {
            this.updateFn(this);
        }
    }
    load(): GraphicsContext {
        return this;
    }
    createPass(name: string, passOptions: PassOptions): Pass {
        if (this.passes[name]) {
            throw new Error(`Pass named '${name}' already exists.`);
        }
        return this.passes[name] = new Pass(passOptions);
    }
    createVertexShader(name: string, source): VertexShader {
        if (this.vertexShaders[name]) {
            throw new Error(`VertexShader named '${name}' already exists.`);
        }
        return this.vertexShaders[name] = new VertexShader(this.gl, name, source);
    }
    createFragmentShader(name: string, source): FragmentShader {
        if (this.fragmentShaders[name]) {
            throw new Error(`FragmentShader named '${name}' already exists.`);
        }
        return this.fragmentShaders[name] = new FragmentShader(this.gl, name, source);
    }
    createProgram(name: string, vs, fs): FragmentShader {
        if (this.programs[name]) {
            throw new Error(`Program named '${name}' already exists.`);
        }
        const vertexShader = this.vertexShaders[vs];
        const fragmentShader = this.fragmentShaders[fs];
        if (!vertexShader) {
            throw new Error(`VertexShader named '${vs}' does not exist.`);
        }
        if (!fragmentShader) {
            throw new Error(`VertexShader named '${fs}' does not exist.`);
        }
        return this.programs[name] = new Program(this.gl, name, vertexShader, fragmentShader);
    }
    createPipelineState(name: string, options: PipelineStateOptions): PipelineState {
        if (this.pipelineStates[name]) {
            throw new Error(`Pipeline State named '${name}' already exists.`);
        }
        return this.pipelineStates[name] = new PipelineState(name, options);
    }
    createPipeline(name: string, program: string, pipelineState: string): Pipeline {
        if (this.pipelineStates[name]) {
            throw new Error(`Pipeline State named '${name}' already exists.`);
        }
        const prog = this.programs[program];
        const pipeState = this.pipelineStates[pipelineState];
        if (!prog) {
            throw new Error(`Program named '${program}' does not exist.`);
        }
        if (!pipeState) {
            throw new Error(`PipelineState named '${pipelineState}' does not exist.`);
        }
        return this.pipelines[name] = new Pipeline(name, prog, pipeState);
    }
    createMesh(name: string, vertexBuffers: Object[], pipeline: Object): DrawState {
        if (this.pipelineStates[name]) {
            throw new Error(`Mesh State named '${name}' already exists.`);
        }
        return this.meshes[name] = new Mesh(name, vertexBuffers, pipeline);
    }
    createDrawState(name: string, mesh: string, pipeline: string): DrawState {
        if (this.pipelineStates[name]) {
            throw new Error(`DrawState State named '${name}' already exists.`);
        }
        const meshObj = this.meshes[mesh];
        const pipe = this.pipelines[pipeline];
        if (!meshObj) {
            throw new Error(`Mesh named '${mesh}' does not exist.`);
        }
        if (!pipe) {
            throw new Error(`Pipeline named '${pipeline}' does not exist.`);
        }
        return this.drawStates[name] = new DrawState(name, meshObj, pipe);
    }
    batchLoad({ passes, vertexShaders, fragmentShaders, programs, textures, meshes, pipelineStates, pipelines, drawStates }: BatchLoadOptions): GraphicsContext {
        if (passes) {
            objForEach(passes, (passOptions, passName) => this.createPass(passName, passOptions));
        }
        if (vertexShaders) {
            objForEach(vertexShaders, (s, shaderName) => this.createVertexShader(shaderName, s.source));
        }
        if (fragmentShaders) {
            objForEach(fragmentShaders, (s, shaderName) => this.createFragmentShader(shaderName, s.source));
        }
        if (programs) {
            objForEach(programs, (shaderNames, programName) => this.createProgram(programName, shaderNames.vs, shaderNames.fs));
        }
        if (pipelineStates) {
            objForEach(pipelineStates, (state, name) => this.createPipelineState(name, state));
        }
        if (pipelines) {
            objForEach(pipelines, (pipelineData, name) => this.createPipeline(name, pipelineData.program, pipelineData.pipelineState));
        }
        if (meshes) {
            objForEach(meshes, (mesh, name) => this.createMesh(name, mesh.vertexBuffers, mesh.indexBuffer));
        }
        if (drawStates) {
            objForEach(drawStates, (drawState, name) => this.createDrawState(name, drawState.pipeline, drawState.mesh));
        }
        return this;
    }
    onContexLoss(callback: (newContext: GraphicsContext) => void): GraphicsContext {
        return this;
    }
    onFullscreenChange(onFullscreenFn: (isFullscreen: boolean) => void): GraphicsContext {
        return this;
    }
    onFrame(updateFn: (context: GraphicsContext) => void): GraphicsContext {
        this.updateFn = updateFn;
        if (!this.nextFrameRequired) {
            this.nextFrameRequired = true;
            this.requireNextFrame();
        }
        return this;
    }
    uploadDataToBuffer(bufferOrName, data:ArrayBufferView, usage:Usage): GraphicsContext {
        const { gl } = this;
        const buffer: Buffer = bufferOrName instanceof Buffer ? bufferOrName as Buffer : this.buffers['name'];
        if (!buffer) {
            throw new Error(`Buffer does not exist.`);
        }
        buffer.uploadData(data, usage);
        return this;
    }
    uploadSubDataToBuffer(bufferOrName, data:ArrayBufferView, offset:number): GraphicsContext {
        const { gl } = this;
        const buffer: Buffer = bufferOrName instanceof Buffer ? bufferOrName as Buffer : this.buffers['name'];
        if (!buffer) {
            throw new Error(`Buffer does not exist.`);
        }
        buffer.uploadSubData(data, offset);
        return this;
    }
    beginPass(pass: Pass): GraphicsContext {
        const isDefaultPass: boolean = !pass.colorAttachments[0].texture;
        const { gl } = this;
        /*
        const width = isDefaultPass ? gl.canvas.width : pass.colorAttachment[0].texture.width;
        const height = isDefaultPass ? gl.canvas.height : pass.colorAttachment[0].texture.height;
        */
        const width = gl.canvas.width;
        const height = gl.canvas.height;

        // FIXME: bind offscreen framebuffer or default framebuffer

        // prepare clear operations
        gl.viewport(0, 0, width, height);
        gl.disable(gl.SCISSOR_TEST);
        gl.colorMask(true, true, true, true);
        gl.depthMask(true);
        gl.stencilMask(0xFF);

        // update cache
        this.pipelineStateCache.scissorTestEnabled = false;
        this.pipelineStateCache.colorWriteMask[0] = true;
        this.pipelineStateCache.colorWriteMask[1] = true;
        this.pipelineStateCache.colorWriteMask[2] = true;
        this.pipelineStateCache.colorWriteMask[3] = true;
        this.pipelineStateCache.depthWriteEnabled = true;
        this.pipelineStateCache.frontStencilWriteMask = 0xFF;
        this.pipelineStateCache.backStencilWriteMask = 0xFF;

        if (isDefaultPass) {
            let clearMask = 0;
            const col = pass.colorAttachments[0];
            const dep = pass.depthAttachment;
            if (col.loadAction === LoadAction.Clear) {
                clearMask |= WebGLRenderingContext.COLOR_BUFFER_BIT;
                gl.clearColor(col.clearColor[0], col.clearColor[1], col.clearColor[2], col.clearColor[3]);
            }
            if (dep.loadAction === LoadAction.Clear) {
                clearMask |= WebGLRenderingContext.DEPTH_BUFFER_BIT | WebGLRenderingContext.STENCIL_BUFFER_BIT;
                gl.clearDepth(dep.clearDepth);
                gl.clearStencil(dep.clearStencil);
            }
            if (clearMask !== 0) {
                gl.clear(clearMask);
            }
        } else {
            // FIXME: handle offscreen rendering 
        }
        return this;
    }
    setViewport(x: number, y: number, width: number, height: number, minDepth?: number, maxDepth?: number): GraphicsContext {
        return this;
    }
    setConstant(name: string, value: any): GraphicsContext {
        return this;
    }
    setDrawState(drawState: DrawState): GraphicsContext {
        const {currentDrawState, gl} = this;
        if (drawState === currentDrawState) {
            return this;
        }
        if (drawState.pipeline !== currentDrawState.pipeline) {
            if (drawState.pipeline.state !== currentDrawState.pipeline.state) {
                applyPipelineState(gl, drawState.pipeline.state, currentDrawState.pipeline.state, this.pipelineStateCache);
            }
            if (drawState.pipeline.program !== currentDrawState.pipeline.program) {
                gl.useProgram(drawState.pipeline.program.program);
            }
        }
        if (drawState.mesh !== currentDrawState.mesh) {
            // apply mesh
        }
        if (drawState.inputLayout !== currentDrawState.inputLayout) {
            // apply new layout
        }
        const textures = drawState.textures;
        const currentTextures = currentDrawState.textures;
        for (let i = 0; textures.length > i; i++) {
            const texture = textures[i];
            const currentTexture = currentTextures[i];
            if (texture !== currentTexture) {
                // apply texture!
            }
        }
        return this;
    }
    draw(baseElement: number, numElements: number): GraphicsContext {
        const { primitiveType, indexFormat, indexSize } = this.currentDrawState.mesh;
        if (indexFormat === IndexFormat.None) {
            this.gl.drawArrays(primitiveType, baseElement, numElements);
        } else {
            this.gl.drawElements(primitiveType, numElements, indexFormat, baseElement * indexSize);
        }
        return this;
    }
    drawMultipleInstances(start: number, count: number, instances: number) {
        return this;
    }
    endPass(): GraphicsContext {
        return this;
    }
    commitFrame(): GraphicsContext {
        if (!this.frameSheduled) {
            this.requireNextFrame();
        }
        this.nextFrameRequired = true;
        return this;
    }
    discard(): void {

    }
}

/**
 * WebGL and canvas initialization options.
 */
export interface GraphicsContextOptions {
    /** name of existing HTML canvas (default: 'canvas') */
    canvas: string;
    /** new width of canvas (default: don't change canvas width) */
    width?: number;
    /** new  height of canvas (default: don't change canvas height) */
    height?: number;
    /** whether drawing buffer should have alpha channel (default: true) */
    alpha?: boolean;
    /** whether drawing buffer should have a depth buffer (default: true) */
    depth?: boolean;
    /** whether drawing buffer should have a stencil buffer (default: false) */
    stencil?: boolean;
    /** whether drawing buffer should be anti-aliased (default: true) */
    antiAlias?: boolean;
    /** whether drawing buffer contains pre-multiplied-alpha colors (default: true) */
    preMultipliedAlpha?: boolean;
    /** whether content of drawing buffer should be preserved (default: false) */
    preserveDrawingBuffer?: boolean;
    /** whether to create a context for low-power-consumption (default: false) */
    preferLowPowerToHighPerformance?: boolean;
    /** whether context creation fails if performance would be low (default: false) */
    failIfMajorPerformanceCaveat?: boolean;
    /** whether to create a high-resolution context on Retina-type displays (default: false) */
    highDPI?: boolean;
}

export interface ProgramOptions {
    vs: string;
    fs: string;
}
export interface PipelineOptions {
    program: string;
    pipelineState: string;
}
export interface AttributeOptions {
    name: string;
    offset?: number;
    stride?: number;
}
export interface VertexBufferOptions {
    name?: string;
    data: number[];
    layout: AttributeOptions[];
}
export interface IndexBufferOptions {
    name?: string;
    data: number[];
}
export interface MeshOptions {
    primitiveType: PrimitiveType;
    vertexBuffers: VertexBufferOptions[];
    indexBuffer?: IndexBufferOptions;
}
export interface DrawStateOptions {
    mesh: string;
    pipeline: string;
    textures?: TextureSampler[];
}
export interface TextureSampler {
    texture: string;
    sampler: string;
}
export interface SamplerOptions {
    type: string;
    src: string;
    data: number[];
}
export interface TextureOptions {
    type: string;
    src: string;
    data: number[];
}

export interface ShaderOptions {
    source: string;
}

export interface BatchLoadOptions {
    passes: { [code: string]: PassOptions; };
    pipelineStates: { [code: string]: PipelineStateOptions; };
    vertexShaders?: { [code: string]: ShaderOptions; };
    fragmentShaders?: { [code: string]: ShaderOptions; };
    programs?: { [code: string]: ProgramOptions; };
    pipelines: { [code: string]: PipelineOptions; };
    meshes: { [code: string]: MeshOptions; };
    textures?: { [code: string]: TextureOptions; };
    drawStates: { [code: string]: DrawStateOptions; };
}