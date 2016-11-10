import { Pass, LoadAction, StoreAction } from './Pass';
import { DrawState } from './DrawState';
import { Pipeline } from './Pipeline';
import { PipelineState, applyPipelineState, PipelineStateOptions } from './PipelineState';
import { Mesh, IndexFormat, PrimitiveType } from './Mesh';

const getTime = typeof performance !== 'undefined' ? () => performance.now() : () => Date.now();
const start = getTime();

const requestFrame = window[['', 'ms', 'moz', 'webkit', 'o']
    .filter(prefix => !!window[prefix + 'RequestAnimationFrame'])[0] + 'RequestAnimationFrame'] || (cb => setTimeout(cb, 16));

export class GraphicsContext {
    readonly passes: { [code: string]: Pass; } = {};
    readonly drawStates: { [code: string]: DrawState; } = {};
    readonly meshes: { [code: string]: Mesh; } = {};
    readonly piplines: { [code: string]: Pipeline; } = {};
    readonly pipelineStates: { [code: string]: PipelineState; } = {};
    readonly canvas: HTMLCanvasElement;
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
        this.frameSheduled = true;
        requestFrame(() => this.update());
    }
    private update(): void {
        if (!this.nextFrameRequired) {
            this.frameSheduled = false;
            return;
        }
        this.requireNextFrame();
        this.nextFrameRequired = false;
    }
    load(): GraphicsContext {
        return this;
    }
    batchLoad(ags: BatchLoadOptions): GraphicsContext {
        return this;
    }
    onContexLoss(callback: (newContext: GraphicsContext) => void): GraphicsContext {
        return this;
    }
    onFullscreenChange(onFullscreenFn: (isFullscreen: boolean) => void): GraphicsContext {
        return this;
    }
    onFrame(updateFn: (context: GraphicsContext) => void): GraphicsContext {
        if (!this.frameSheduled) {
            this.requireNextFrame();
        }
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

export interface ColorAttachmentsOptions {
    clearColor: [number, number, number, number];
}

export interface DepthAttachmentsOptions {
    
}

export interface PassOptions {
    colorAttachments: ColorAttachmentsOptions[];
    depthAttachments?: DepthAttachmentsOptions[];
    storeAction?: StoreAction;
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
    name?:string;
    data: number[];
}
export interface MeshOptions {
    primitiveType: PrimitiveType;
    vertexBuffers: VertexBufferOptions[];
    indexBuffer?: IndexBufferOptions;
}
export interface DrawStateOptions {
    mesh:string;
    pipeline:string;
    textures?:TextureSampler[];
}
export interface TextureSampler {
    texture:string;
    sampler:string;
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

export interface BatchLoadOptions {
    passes: { [code: string]: PassOptions; };
    pipelineStates: { [code: string]: PipelineStateOptions; };
    programs?: { [code: string]: ProgramOptions; };
    pipelines: { [code: string]: PipelineOptions; };
    meshes: { [code: string]: MeshOptions; };
    textures?: { [code: string]: TextureOptions; };
    drawStates: { [code: string]: DrawStateOptions; };
}