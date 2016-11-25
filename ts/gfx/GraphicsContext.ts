import { Pass, LoadAction, StoreAction, PassOptions } from './Pass';
import { VertexShader, FragmentShader, Program } from './Program';
import { DrawState } from './DrawState';
import { Pipeline } from './Pipeline';
import { PipelineState, applyPipelineState, PipelineStateOptions } from './PipelineState';
import { Buffer, Usage, IndexFormat } from './Buffer';
import { Mesh, PrimitiveType } from './Mesh';
import { SamplerState, SamplerStateOptions } from './SamplerState';
import { Capabilities } from './Capabilities';
import Defaults from './Defaults';

const GL = WebGLRenderingContext;
const emptyArray = [];
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
    readonly capabilities: Capabilities;
    private enabledVertexAttributeArrays: number[] = [];
    private updateFn: (context: GraphicsContext) => void;
    private nextFrameRequired: boolean = false;
    private frameSheduled: boolean = false;
    private _gl: WebGLRenderingContext;
    private _currentDrawState: DrawState;
    private _currentPass: Pass;
    private pipelineStateCache: PipelineStateOptions = { colorWriteMask: [void 0, void 0, void 0, void 0], blendColor: [void 0, void 0, void 0, void 0] };
    
    readonly vendor: string;
    readonly rendererName: string;
    get currentPass(): Pass {
        return this._currentPass;
    }
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
        this.capabilities = new Capabilities(this._gl);
        this.gl.viewport(0, 0, this.width, this.height);
        this.batchLoad(Defaults);
        this.vendor = this._gl.getParameter(0x9245);
        this.rendererName = this._gl.getParameter(0x9246);
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
    createProgram(name: string, vs, fs, samplerStates?): Program {
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
        return this.programs[name] = new Program(this.gl, name, vertexShader, fragmentShader, samplerStates);
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
    createMesh(name: string, vertexBuffers: Object[], pipeline: Object): Mesh {
        if (this.pipelineStates[name]) {
            throw new Error(`Mesh State named '${name}' already exists.`);
        }
        return this.meshes[name] = new Mesh(this.gl, name, vertexBuffers, pipeline);
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
        return this.drawStates[name] = new DrawState(name, pipe, meshObj, []);
    }
    batchLoad({ passes, vertexShaders, fragmentShaders, programs, textures, meshes, pipelineStates, pipelines, drawStates }: BatchLoadOptions, callback?): GraphicsContext {
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
        this._currentPass = pass;
        return this;
    }
    setViewport(x: number, y: number, width: number, height: number, minDepth?: number, maxDepth?: number): GraphicsContext {
        return this;
    }
    setConstant(name: string, value: any): GraphicsContext {
        if (!this.currentDrawState) {
            throw new Error(`You have to set a draw state (using 'setDrawState' method) before you set a constant.`);
        }
        const uniform = this.currentDrawState.pipeline.program.uniforms[name];
        if (uniform) {
            uniform.apply(this._gl, uniform.index, value);
        } else {
            console.error(`Uniform '${name}' does not exist for current program '${this.currentDrawState.pipeline.program}'.`);
        }
        return this;
    }
    setDrawState(drawState: DrawState): GraphicsContext {
        if (!this.currentPass) {
            throw new Error(`You have to begin a pass (using 'beginPass' method) before you set a constant.`);
        }
        const {currentDrawState, gl} = this;
        if (drawState === currentDrawState) {
            return this;
        }
        let currPipeline;
        let currPipelineState;
        let currProgram;
        let currMesh;
        let currInputLayout;
        let currTextures;
        if (currentDrawState) {
            currPipeline = currentDrawState.pipeline;
            currPipelineState = currPipeline.state;
            currProgram = currPipeline.program;
            currMesh = currentDrawState.mesh;
            currInputLayout = currentDrawState.inputLayout;
        }
        if (drawState.pipeline !== currPipeline) {
            if (drawState.pipeline.state !== currPipelineState) {
                applyPipelineState(gl, drawState.pipeline.state, currPipelineState, this.pipelineStateCache);
            }
            if (drawState.pipeline.program !== currProgram) {
                if (!drawState.pipeline.program.isInitialized) {
                    drawState.pipeline.program.initialize();
                }
                gl.useProgram(drawState.pipeline.program.program);
            }
        }
        if (drawState.inputLayout !== currInputLayout) {
            const inputLayout = drawState.inputLayout;
            const { vertexBuffers, indexBuffer } = drawState.mesh;
            const evaArray = this.enabledVertexAttributeArrays;
            // apply new layout
            if (!inputLayout.isInitialized) {
                inputLayout.initialize(drawState.mesh, drawState.pipeline.program);
            }
            for (let idx = 0; idx < evaArray.length; idx++) {
                const index = evaArray[idx];
                if (index == 0) {
                    continue;
                }
                gl.disableVertexAttribArray(index);
            }
            evaArray.length = 0;
            inputLayout.vertexAttributes.forEach(element => {
                const { index } = element;
                const vb = vertexBuffers[element.slot];
                if (vb == null) {
                    console.error('Prepare for draw referenced a null vertex buffer object');
                    return;
                }
                gl.enableVertexAttribArray(index);
                gl.bindBuffer(vb.bindTarget, vb.buffer);
                gl.vertexAttribPointer(index, element.size, element.type, element.normalize, element.stride, element.offset);
                evaArray.push(index);
            });
            if (indexBuffer) {
                gl.bindBuffer(indexBuffer.bindTarget, indexBuffer.buffer);
            } else {
                gl.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, void 0);
            }
        }
        const textures = drawState.textures;
        const currentTextures = currentDrawState ? currentDrawState.textures : emptyArray;
        for (let i = 0; textures.length > i; i++) {
            const texture = textures[i];
            const currentTexture = currentTextures[i];
            if (texture !== currentTexture) {
                /* for (int i = 0; i < numTextures; i++) {
                        SamplerState sampler = _samplerStateHandles[i];
                        SpectreTexture texture = _textureHandles[i];
                        device.gl.activeTexture(WebGL.TEXTURE0 + i);
                        device.gl.bindTexture(WebGL.TEXTURE_2D, null);
                        device.gl.bindTexture(WebGL.TEXTURE_CUBE_MAP, null);
                        if (sampler == null || texture == null) {
                            continue;
                        }
                        texture._bind(WebGL.TEXTURE0 + i);
                        texture._applySampler(sampler);
                    }*/
                // apply texture!
            }
        }
        this._currentDrawState = drawState;
        return this;
    }
    draw(baseElement: number, numElements: number): GraphicsContext {
        if (!this.currentDrawState) {
            throw new Error(`You have to set a draw state (using 'setDrawState' method) before you use draw.`);
        }
        const { primitiveType, indexFormat, indexSize } = this.currentDrawState.mesh;
        if (indexFormat === IndexFormat.None) {
            this.gl.drawArrays(primitiveType, baseElement, numElements);
        } else {
            this.gl.drawElements(primitiveType, numElements, indexFormat, baseElement * indexSize);
        }
        return this;
    }
    drawMultipleInstances(start: number, count: number, instances: number) {
        if (!this.currentDrawState) {
            throw new Error(`You have to set a draw state (using 'setDrawState' method) before you use drawMultipleInstances.`);
        }
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
        const { gl, passes, vertexShaders, fragmentShaders, programs, pipelineStates, pipelines, meshes, drawStates } = this;
        for (const member in passes) {
            delete passes[member];
        }
        for (const shaderName in vertexShaders) {
            gl.deleteShader(vertexShaders[shaderName].shader);
            delete vertexShaders[shaderName];
        }
        for (const shaderName in fragmentShaders) {
            gl.deleteShader(fragmentShaders[shaderName].shader);
            delete fragmentShaders[shaderName];
        }
        for (const programName in programs) {
            gl.deleteProgram(programs[programName].program);
            delete programs[programName];
        }
        for (const stateName in pipelineStates) {
            delete pipelineStates[stateName];
        }
        for (const pipelineName in pipelines) {
            delete pipelines[pipelineName];
        }
        for (const meshName in meshes) {
            const mesh = meshes[meshName];
            mesh.vertexBuffers.forEach(vb => gl.deleteBuffer(vb.buffer));
            gl.deleteBuffer(mesh.indexBuffer.buffer);
            delete meshes[meshName];
        }
        for (const drawStateName in drawStates) {
            delete drawStates[drawStateName];
        }
    }
}

export interface DiscardAble {
    discard(): void;
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
/**
 * AttributeOptions
 * If you only provide the name of the Attribute the offset and stride will be calculated.
 * Provided the used program uses all provided properties. The properties have to be provided
 * in the order how they appear in the VertexBuffers through. Otherwise the offsets will be incorrect.
 */
export interface AttributeOptions {
    /** Attribute name inside the shader */
    name: string;
    /** Size of the attribute, length of the array (currently ignored) */
    size: number;
    /** Offset inside the VertexShader */
    offset: number;
    /** Stride of the attribute */
    stride: number;
}

export interface VertexBufferOptions {
    name?: string;
    data: number[] | Float32Array;
    attributes: AttributeOptions[] | string[];
}
export interface IndexBufferOptions {
    name?: string;
    data: number[] | Uint16Array | Uint32Array;
}
export interface MeshOptions {
    primitiveType: PrimitiveType;
    vertexBuffers: VertexBufferOptions[];
    indexBuffer?: IndexBufferOptions;
}
export interface DrawStateOptions {
    mesh: string;
    pipeline: string;
    textures?: { [code: string]: SamplerOptions; };
}

export interface SamplerOptions {
    texture: string;
    sampler: string;
}

export interface TextureSampler {
    texture: string;
    sampler: string;
}
export interface SamplerOptions {
    type: string;
    src: string;
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
    passes?: { [code: string]: PassOptions; };
    pipelineStates?: { [code: string]: PipelineStateOptions; };
    vertexShaders?: { [code: string]: ShaderOptions; };
    fragmentShaders?: { [code: string]: ShaderOptions; };
    programs?: { [code: string]: ProgramOptions; };
    pipelines?: { [code: string]: PipelineOptions; };
    meshes?: { [code: string]: MeshOptions; };
    textures?: { [code: string]: TextureOptions; };
    samplerStates?: { [code: string]: SamplerStateOptions; };
    drawStates?: { [code: string]: DrawStateOptions; };
}