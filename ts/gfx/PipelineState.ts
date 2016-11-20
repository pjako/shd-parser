
const some = (val0, val1) => val0 !== undefined ? val0 : val1;


export class PipelineState implements PipelineStateOptions {
    readonly name: string;
    readonly blendEnabled: boolean;
    readonly blendSrcFactor: BlendFactor;
    readonly blendDstFactor: BlendFactor;
    readonly blendOp: BlendOp;
    readonly blendColor: [number, number, number, number];
    readonly colorWriteMask: [boolean, boolean, boolean, boolean] = [true, true, true, true];
    readonly blendSrcFactorRGB: BlendFactor;
    readonly blendDstFactorRGB: BlendFactor;
    readonly blendOpRGB: BlendOp;
    readonly blendSrcFactorAlpha: BlendFactor;
    readonly blendDstFactorAlpha: BlendFactor;
    readonly blendOpAlpha: BlendOp;
    readonly stencilEnabled: boolean;
    readonly stencilFailOp: StencilOp;
    readonly stencilDepthFailOp: StencilOp;
    readonly stencilPassOp: StencilOp;
    readonly stencilCmpFunc: CompareFunc;
    readonly stencilReadMask: number;
    readonly stencilWriteMask: number;
    readonly stencilRef: number;
    readonly frontStencilFailOp: StencilOp;
    readonly frontStencilDepthFailOp: StencilOp;
    readonly frontStencilPassOp: StencilOp;
    readonly frontStencilCmpFunc: CompareFunc;
    readonly frontStencilReadMask: number;
    readonly frontStencilWriteMask: number;
    readonly frontStencilRef: number;
    readonly backStencilFailOp: StencilOp;
    readonly backStencilDepthFailOp: StencilOp;
    readonly backStencilPassOp: StencilOp;
    readonly backStencilCmpFunc: CompareFunc;
    readonly backStencilReadMask: number;
    readonly backStencilWriteMask: number;
    readonly backStencilRef: number;
    readonly depthCmpFunc: CompareFunc;
    readonly depthWriteEnabled: boolean;
    readonly cullFaceEnabled: boolean;
    readonly cullFace: Face;
    readonly scissorTestEnabled: boolean;
    constructor(name, args) {
        this.name = name;
        this.blendEnabled = args.blendEnabled || false;
        this.blendSrcFactor = typeof args.blendSrcFactor === 'number' ? args.blendSrcFactor : some(BlendFactor[args.blendSrcFactor], BlendFactor.One);
        this.blendDstFactor = typeof args.blendDstFactor === 'number' ? args.blendDstFactor : some(BlendFactor[args.blendSrcFactor], BlendFactor.Zero);
        this.blendOp = typeof args.blendOp === 'number' ? args.blendOp : some(BlendOp[args.blendOp], BlendOp.Add);
        if (args.blendColor) {
            this.blendColor = [args.blendColor[0] || 1, args.blendColor[1] || 1, args.blendColor[2] || 1, args.blendColor[3] || 1];
        } else {
            this.blendColor = [1, 1, 1, 1];
        }
        if (args.colorWriteMask) {
            this.colorWriteMask[0] = !(args.colorWriteMask[0] === false);
            this.colorWriteMask[1] = !(args.colorWriteMask[1] === false);
            this.colorWriteMask[2] = !(args.colorWriteMask[2] === false);
            this.colorWriteMask[3] = !(args.colorWriteMask[3] === false);
        }
        this.blendSrcFactorRGB = typeof args.blendSrcFactorRGB === 'number' ? args.blendSrcFactorRGB : some(BlendFactor[args.blendSrcFactorRGB], BlendFactor.One);
        this.blendDstFactorRGB = typeof args.blendDstFactorRGB === 'number' ? args.blendDstFactorRGB : some(BlendFactor[args.blendSrcFactorRGB], BlendFactor.Zero);
        this.blendOpRGB = typeof args.blendOpRGB === 'number' ? args.blendOpRGB : some(BlendOp[args.blendOpRGB], BlendOp.Add);
        this.blendSrcFactorAlpha = typeof args.blendSrcFactorAlpha === 'number' ? args.blendSrcFactorAlpha : some(BlendFactor[args.blendSrcFactorAlpha], BlendFactor.One);
        this.blendDstFactorAlpha = typeof args.blendDstFactorAlpha === 'number' ? args.blendDstFactorAlpha : some(BlendFactor[args.blendDstFactorAlpha], BlendFactor.Zero);
        this.blendOpAlpha = typeof args.blendSrcFactor === 'number' ? args.blendSrcFactor : some(BlendOp[args.blendOpAlpha], BlendOp.Add);

        this.stencilEnabled = args.stencilEnabled || false;
        this.stencilFailOp = typeof args.stencilFailOp === 'number' ? args.stencilFailOp : some(StencilOp[args.stencilFailOp], StencilOp.Keep);
        this.stencilDepthFailOp = typeof args.stencilDepthFailOp === 'number' ? args.stencilDepthFailOp : some(StencilOp[args.stencilDepthFailOp], StencilOp.Keep);
        this.stencilPassOp = typeof args.stencilPassOp === 'number' ? args.stencilPassOp : some(StencilOp[args.stencilPassOp], StencilOp.Keep);
        this.stencilCmpFunc = typeof args.stencilCmpFunc === 'number' ? args.stencilCmpFunc : some(CompareFunc[args.stencilCmpFunc], CompareFunc.Always);
        this.stencilReadMask = typeof args.stencilReadMask === 'number' ? args.stencilReadMask : args.stencilReadMask !== void 0 ? Number(args.stencilReadMask) : 0xFF;
        this.stencilWriteMask = typeof args.stencilWriteMask === 'number' ? args.stencilWriteMask : args.stencilWriteMask !== void 0 ? Number(args.stencilWriteMask) : 0xFF;
        this.stencilRef = typeof args.stencilRef === 'number' ? args.stencilRef : args.stencilRef || 0;

        this.frontStencilFailOp = typeof args.frontStencilFailOp === 'number' ? args.frontStencilFailOp : some(StencilOp[args.frontStencilFailOp], StencilOp.Keep);
        this.frontStencilDepthFailOp = typeof args.frontStencilDepthFailOp === 'number' ? args.frontStencilDepthFailOp : some(StencilOp[args.frontStencilDepthFailOp], StencilOp.Keep);
        this.frontStencilPassOp = typeof args.frontStencilPassOp === 'number' ? args.frontStencilPassOp : some(StencilOp[args.frontStencilPassOp], StencilOp.Keep);
        this.frontStencilCmpFunc = typeof args.frontStencilCmpFunc === 'number' ? args.frontStencilCmpFunc : some(CompareFunc[args.frontStencilCmpFunc], CompareFunc.Always);
        this.frontStencilReadMask = args.frontStencilReadMask !== void 0 ? Number(args.frontStencilReadMask) : 0xFF;
        this.frontStencilWriteMask = args.frontStencilWriteMask !== void 0 ? Number(args.frontStencilWriteMask) : 0xFF;
        this.frontStencilRef = args.frontStencilRef || 0;

        this.backStencilFailOp = typeof args.backStencilFailOp === 'number' ? args.backStencilFailOp : some(StencilOp[args.backStencilFailOp], StencilOp.Keep);
        this.backStencilDepthFailOp = typeof args.backStencilDepthFailOp === 'number' ? args.backStencilDepthFailOp : some(StencilOp[args.backStencilDepthFailOp], StencilOp.Keep);
        this.backStencilPassOp = typeof args.backStencilPassOp === 'number' ? args.backStencilPassOp : some(StencilOp[args.backStencilPassOp], StencilOp.Keep);
        this.backStencilCmpFunc = typeof args.backStencilCmpFunc === 'number' ? args.backStencilCmpFunc : some(CompareFunc[args.backStencilCmpFunc], CompareFunc.Always);
        this.backStencilReadMask = args.backStencilReadMask !== void 0 ? Number(args.backStencilReadMask) : 0xFF;
        this.backStencilWriteMask = args.backStencilWriteMask !== void 0 ? Number(args.backStencilWriteMask) : 0xFF;
        this.backStencilRef = args.backStencilRef || 0;

        this.depthCmpFunc = typeof args.depthCmpFunc === 'number' ? args.depthCmpFunc : some(CompareFunc[args.depthCmpFunc], CompareFunc.Always);
        this.depthWriteEnabled = args.depthWriteEnabled || false;
        this.cullFaceEnabled = args.cullFaceEnabled || false;
        this.cullFace = typeof args.cullFace === 'number' ? args.cullFace : some(Face[args.cullFace], Face.Back);
        this.scissorTestEnabled = args.scissorTestEnabled || false;
    }
}
const dummyOldState: PipelineStateOptions = { colorWriteMask: [void 0, void 0, void 0, void 0], blendColor: [void 0, void 0, void 0, void 0] };
const dummyCache: PipelineStateOptions = { colorWriteMask: [void 0, void 0, void 0, void 0], blendColor: [void 0, void 0, void 0, void 0] };
export function applyPipelineState(gl: WebGLRenderingContext, state: PipelineStateOptions, oldState?: PipelineStateOptions, cache?: PipelineStateOptions): void {
    oldState = oldState || dummyOldState;
    cache = cache || dummyCache;
    // apply depth-stencil state changes
    if (state.depthCmpFunc !== oldState.depthCmpFunc) {
        cache.depthCmpFunc = state.depthCmpFunc;
        gl.depthFunc(state.depthCmpFunc);
    }
    if (state.depthWriteEnabled !== oldState.depthWriteEnabled) {
        cache.depthWriteEnabled = state.depthWriteEnabled;
        gl.depthMask(state.depthWriteEnabled);
    }
    if (state.stencilEnabled !== oldState.stencilEnabled) {
        cache.stencilEnabled = state.stencilEnabled;
        if (oldState.stencilEnabled) {
            gl.enable(gl.STENCIL_TEST);
        } else {
            gl.disable(gl.STENCIL_TEST);
        }
    }
    let sCmpFunc = state.frontStencilCmpFunc;
    let sReadMask = state.frontStencilReadMask;
    let sRef = state.frontStencilRef;
    if (
        (state.frontStencilCmpFunc !== sCmpFunc) ||
        (state.frontStencilReadMask !== sReadMask) ||
        (state.frontStencilRef !== sRef) )
    {                
        cache.frontStencilCmpFunc = sCmpFunc;
        cache.frontStencilReadMask = sReadMask;
        cache.frontStencilRef = sRef;
        gl.stencilFuncSeparate(gl.FRONT, sCmpFunc, sRef, sReadMask);
    }
    sCmpFunc = state.backStencilCmpFunc;
    sReadMask = state.backStencilReadMask;
    sRef = state.backStencilRef;
    if ((state.backStencilCmpFunc !== sCmpFunc) ||
        (state.backStencilReadMask !== sReadMask) ||
        (state.backStencilRef !== sRef))
    {                
        cache.backStencilCmpFunc = sCmpFunc;
        cache.backStencilReadMask = sReadMask;
        cache.backStencilRef = sRef;
        gl.stencilFuncSeparate(gl.BACK, sCmpFunc, sRef, sReadMask);
    }
    let sFailOp = state.frontStencilFailOp;
    let sDepthFailOp = state.frontStencilDepthFailOp;
    let sPassOp = state.frontStencilPassOp;
    if ((state.frontStencilFailOp !== sFailOp) ||
        (state.frontStencilDepthFailOp !== sDepthFailOp) ||
        (state.frontStencilPassOp !== sPassOp)) 
    {    
        cache.frontStencilFailOp = sFailOp;
        cache.frontStencilDepthFailOp = sDepthFailOp;
        cache.frontStencilPassOp = sPassOp;
        gl.stencilOpSeparate(gl.FRONT, sFailOp, sDepthFailOp, sPassOp);
    }
    sFailOp = state.backStencilFailOp;
    sDepthFailOp = state.backStencilDepthFailOp;
    sPassOp = state.backStencilPassOp;
    if ((state.backStencilFailOp !== sFailOp) ||
        (state.backStencilDepthFailOp !== sDepthFailOp) ||
        (state.backStencilPassOp !== sPassOp))
    {    
        cache.backStencilFailOp = sFailOp;
        cache.backStencilDepthFailOp = sDepthFailOp;
        cache.backStencilPassOp = sPassOp;
        gl.stencilOpSeparate(gl.BACK, sFailOp, sDepthFailOp, sPassOp);
    }
    if (state.frontStencilWriteMask !== oldState.frontStencilWriteMask) {
        cache.frontStencilWriteMask = state.frontStencilWriteMask;
        gl.stencilMaskSeparate(gl.FRONT, state.frontStencilWriteMask)
    }
    if (state.backStencilWriteMask !== oldState.backStencilWriteMask) {
        cache.backStencilWriteMask = state.backStencilWriteMask;
        gl.stencilMaskSeparate(gl.BACK, state.backStencilWriteMask);
    }

    // apply blend state changes
    if (state.blendEnabled !== oldState.blendEnabled) {
        cache.blendEnabled = state.blendEnabled;
        gl.enable(gl.BLEND);
    }
    if ((state.blendSrcFactorRGB !== oldState.blendSrcFactorRGB) ||
        (state.blendDstFactorRGB !== oldState.blendDstFactorRGB) ||
        (state.blendSrcFactorAlpha !== oldState.blendSrcFactorAlpha) ||
        (state.blendDstFactorAlpha !== oldState.blendDstFactorAlpha))
    {
        cache.blendSrcFactorRGB = state.blendSrcFactorRGB;
        cache.blendDstFactorRGB = state.blendDstFactorRGB;
        cache.blendSrcFactorAlpha = state.blendSrcFactorAlpha;
        cache.blendDstFactorAlpha = state.blendDstFactorAlpha;
        gl.blendFuncSeparate(state.blendSrcFactorRGB, 
                                    state.blendDstFactorRGB, 
                                    state.blendSrcFactorAlpha, 
                                    state.blendDstFactorAlpha);
    } 
    if ((state.blendOpRGB !== oldState.blendOpRGB) ||
        (state.blendOpAlpha !== oldState.blendOpAlpha))
    {
        state.blendOpRGB = state.blendOpRGB;
        state.blendOpAlpha = state.blendOpAlpha;
        gl.blendEquationSeparate(state.blendOpRGB, state.blendOpAlpha);
    }
    if ((state.colorWriteMask[0] !== oldState.colorWriteMask[0]) ||
        (state.colorWriteMask[1] !== oldState.colorWriteMask[1]) ||
        (state.colorWriteMask[2] !== oldState.colorWriteMask[2]) ||
        (state.colorWriteMask[3] !== oldState.colorWriteMask[3]))
    {
        cache.colorWriteMask[0] = state.colorWriteMask[0];
        cache.colorWriteMask[1] = state.colorWriteMask[1];
        cache.colorWriteMask[2] = state.colorWriteMask[2];
        cache.colorWriteMask[3] = state.colorWriteMask[3];
        gl.colorMask(state.colorWriteMask[0], state.colorWriteMask[1], state.colorWriteMask[2], state.colorWriteMask[3]);
    }
    if ((state.blendColor[0] !== oldState.blendColor[0]) ||
        (state.blendColor[1] !== oldState.blendColor[1]) ||
        (state.blendColor[2] !== oldState.blendColor[2]) ||
        (state.blendColor[3] !== oldState.blendColor[3]))
    {
        cache.blendColor[0] = state.blendColor[0];
        cache.blendColor[1] = state.blendColor[1];
        cache.blendColor[2] = state.blendColor[2];
        cache.blendColor[3] = state.blendColor[3];
        gl.blendColor(state.blendColor[0], state.blendColor[1], state.blendColor[2], state.blendColor[3]);
    }

    // apply rasterizer state
    if (state.cullFaceEnabled !== oldState.cullFaceEnabled) {
        cache.cullFaceEnabled = state.cullFaceEnabled;
        if (oldState.cullFaceEnabled) {
            gl.enable(gl.CULL_FACE);
        } else {
            gl.disable(gl.CULL_FACE);
        }  
    }
    if (state.cullFace !== oldState.cullFace) {
        cache.cullFace = state.cullFace;
        gl.cullFace(state.cullFace);
    }
    if (state.scissorTestEnabled !== oldState.scissorTestEnabled) {
        cache.scissorTestEnabled = state.scissorTestEnabled;
        if (oldState.scissorTestEnabled) {
            gl.enable(gl.SCISSOR_TEST);
        } else {
            gl.disable(gl.SCISSOR_TEST);
        }
    }
}

/**
 * identify front/back sides for face culling.
 */
export enum Face {
    /** cull front side */
    Front = WebGLRenderingContext.FRONT,
    /** cull back side */
    Back = WebGLRenderingContext.BACK,
    /** cull both sides */
    Both = WebGLRenderingContext.FRONT_AND_BACK,
}

/**
 * Comparision functions for depth and stencil checks.
 */
export enum CompareFunc {
    Never = WebGLRenderingContext.NEVER,
    Less = WebGLRenderingContext.LESS,
    Equal = WebGLRenderingContext.EQUAL,
    LessEqual = WebGLRenderingContext.LEQUAL,
    Greater = WebGLRenderingContext.GREATER,
    NotEqual = WebGLRenderingContext.NOTEQUAL,
    GreaterEqual = WebGLRenderingContext.GEQUAL,
    Always = WebGLRenderingContext.ALWAYS,
}

export enum StencilOp {
    Keep = WebGLRenderingContext.KEEP,
    Zero = WebGLRenderingContext.ZERO,
    Replace = WebGLRenderingContext.REPLACE,
    IncrClamp = WebGLRenderingContext.INCR,
    DecrClamp = WebGLRenderingContext.DECR,
    Invert = WebGLRenderingContext.INVERT,
    IncrWrap = WebGLRenderingContext.INCR_WRAP,
    DecrWrap = WebGLRenderingContext.DECR_WRAP,
}

export enum BlendFactor {
    Zero = WebGLRenderingContext.ZERO,
    One = WebGLRenderingContext.ONE,
    SrcColor = WebGLRenderingContext.SRC_COLOR,
    OneMinusSrcColor = WebGLRenderingContext.ONE_MINUS_SRC_COLOR,
    SrcAlpha = WebGLRenderingContext.SRC_ALPHA,
    OneMinusSrcAlpha = WebGLRenderingContext.ONE_MINUS_SRC_ALPHA,
    DstColor = WebGLRenderingContext.DST_COLOR,
    OneMinusDstColor = WebGLRenderingContext.ONE_MINUS_DST_COLOR,
    DstAlpha = WebGLRenderingContext.DST_ALPHA,
    OneMinusDstAlpha = WebGLRenderingContext.ONE_MINUS_DST_ALPHA,
    SrcAlphaSaturated = WebGLRenderingContext.SRC_ALPHA_SATURATE,
    BlendColor = WebGLRenderingContext.CONSTANT_COLOR,
    OneMinusBlendColor = WebGLRenderingContext.ONE_MINUS_CONSTANT_COLOR,
    BlendAlpha = WebGLRenderingContext.CONSTANT_ALPHA,
    OneMinusBlendAlpha = WebGLRenderingContext.ONE_MINUS_CONSTANT_ALPHA,
}

export enum BlendOp {
    Add = WebGLRenderingContext.FUNC_ADD,
    Subtract = WebGLRenderingContext.FUNC_SUBTRACT,
    ReverseSubtract = WebGLRenderingContext.FUNC_REVERSE_SUBTRACT,
}
export interface PipelineStateOptions {
    blendEnabled?: boolean;
    blendSrcFactor?: BlendFactor;
    blendDstFactor?: BlendFactor;
    blendOp?: BlendOp;
    blendColor?: [number, number, number, number];
    blendSrcFactorRGB?: BlendFactor;
    blendDstFactorRGB?: BlendFactor;
    blendOpRGB?: BlendOp;
    blendSrcFactorAlpha?: BlendFactor;
    blendDstFactorAlpha?: BlendFactor;
    blendOpAlpha?: BlendOp;
    stencilEnabled?: boolean;
    stencilFailOp?: StencilOp;
    stencilDepthFailOp?: StencilOp;
    stencilPassOp?: StencilOp;
    stencilCmpFunc?: CompareFunc;
    stencilReadMask?: number;
    stencilWriteMask?: number;
    stencilRef?: number;
    frontStencilFailOp?: StencilOp;
    frontStencilDepthFailOp?: StencilOp;
    frontStencilPassOp?: StencilOp;
    frontStencilCmpFunc?: CompareFunc;
    frontStencilReadMask?: number;
    frontStencilWriteMask?: number;
    frontStencilRef?: number;
    backStencilFailOp?: StencilOp;
    backStencilDepthFailOp?: StencilOp;
    backStencilPassOp?: StencilOp;
    backStencilCmpFunc?: CompareFunc;
    backStencilReadMask?: number;
    backStencilWriteMask?: number;
    backStencilRef?: number;
    depthCmpFunc?: CompareFunc;
    depthWriteEnabled?: boolean;
    cullFaceEnabled?: boolean;
    cullFace?: Face;
    scissorTestEnabled?: boolean;
    colorWriteMask?: [boolean, boolean, boolean, boolean];
}