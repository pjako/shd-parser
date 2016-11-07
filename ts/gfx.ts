const GL = WebGLRenderingContext;
export enum LoadAction {
    DontCare,
    Load,
    Clear,
}
export enum StoreAction {
    DontCare,
    Store,
    Resolve,
    StoreAndResolve,
}
/**
 * Vertex index formats.
 */
export enum IndexFormat {
    /** no vertex indices */
    None = WebGLRenderingContext.NONE,
    /** 16-bit indices */ 
    UShort = WebGLRenderingContext.UNSIGNED_SHORT,
    /** 32-bit indices */
    UInt = WebGLRenderingContext.UNSIGNED_INT,
}

/**
 * 3D primitive types.
 */
export enum PrimitiveType {
    /** point list */
    Points = WebGLRenderingContext.POINTS,
    /** line list */
    Lines = WebGLRenderingContext.LINES,
    /** line strip */
    LineStrip = WebGLRenderingContext.LINE_STRIP,
    /** triangle list */
    Triangles = WebGLRenderingContext.TRIANGLES,
    /** triangle strip */
    TriangleStrip = WebGLRenderingContext.TRIANGLE_STRIP,
}

 function convertType(type:number) {
    const GL = WebGLRenderingContext;
    switch (type) {
        case GL.FLOAT:
        return 'float';
        case GL.FLOAT_VEC2:
        return 'vec2';
        case GL.FLOAT_VEC3:
        return 'vec3';
        case GL.FLOAT_VEC4:
        return 'vec4';
        case GL.FLOAT_MAT2:
        return 'mat2';
        case GL.FLOAT_MAT3:
        return 'mat3';
        case GL.FLOAT_MAT4:
        return 'mat4';
        case GL.BOOL:
        return 'bool';
        case GL.BOOL_VEC2:
        return 'bvec2';
        case GL.BOOL_VEC3:
        return 'bvec3';
        case GL.BOOL_VEC4:
        return 'bvec4';
        case GL.INT:
        return 'int';
        case GL.INT_VEC2:
        return 'ivec2';
        case GL.INT_VEC3:
        return 'ivec3';
        case GL.INT_VEC4:
        return 'ivec4';
        case GL.SAMPLER_2D:
        return 'sampler2D';
        case GL.SAMPLER_CUBE:
        return 'samplerCube';
    }
    return '';
  }


function parseCullFace(value) {
    const GL = WebGLRenderingContext;
    switch (value) {
        case 'Front':
        return GL.FRONT;
        case 'Back':
        return GL.BACK;
        case 'Both':
        return GL.FRONT_AND_BACK;
    }
}
function parseCompareFunc(value) {
    const GL = WebGLRenderingContext;
    switch (value) {
        case 'Never':
        return GL.NEVER;
        case 'Less':
        return GL.LESS;
        case 'Equal':
        return GL.EQUAL;
        case 'LessEqual':
        return GL.LEQUAL;
        case 'Greater':
        return GL.GREATER;
        case 'NotEqual':
        return GL.NOTEQUAL;
        case 'GreaterEqual':
        return GL.GEQUAL;
        case 'Always':
        return GL.ALWAYS;
    }
}
function parseStencilOp(value) {
    const GL = WebGLRenderingContext;
    switch (value) {
        case 'Keep':
        return GL.KEEP;
        case 'Replace':
        return GL.REPLACE;
        case 'IncrClamp':
        return GL.INCR;
        case 'DecrClamp':
        return GL.DECR;
        case 'IncrWrap':
        return GL.INCR_WRAP;
        case 'DecrWrap':
        return GL.DECR_WRAP;
    }
}

function parseBlendOp(value) {
    const GL = WebGLRenderingContext;
    switch (value) {
        case 'Add':
        return GL.FUNC_ADD;
        case 'Subtract':
        return GL.FUNC_SUBTRACT;
        case 'ReverseSubtract':
        return GL.FUNC_REVERSE_SUBTRACT;
    }
}
function parseBlend(value) {
    const GL = WebGLRenderingContext;
    switch (value) {
        case 'Zero':
        return GL.ZERO;
        case 'SrcColor':
        return GL.SRC_COLOR;
        case 'OneMinusSrcColor':
        return GL.ONE_MINUS_SRC_COLOR;
        case 'SrcAlpha':
        return GL.SRC_ALPHA;
        case 'OneMinusSrcAlpha':
        return GL.ONE_MINUS_SRC_ALPHA;
        case 'DstColor':
        return GL.DST_COLOR;
        case 'OneMinusDstColor':
        return GL.ONE_MINUS_DST_COLOR;
        case 'DstAlpha':
        return GL.DST_ALPHA;
        case 'OneMinusDstAlpha':
        return GL.ONE_MINUS_DST_ALPHA;
        case 'SrcAlphaSaturated':
        return GL.SRC_ALPHA_SATURATE;
        case 'BlendColor':
        return GL.CONSTANT_COLOR;
        case 'OneMinusBlendColor':
        return GL.ONE_MINUS_CONSTANT_COLOR;
        case 'BlendAlpha':
        return GL.CONSTANT_ALPHA;
        case 'OneMinusBlendAlpha':
        return GL.ONE_MINUS_CONSTANT_ALPHA;
    }

}
class PipelineState {
    readonly name:string;
    readonly blend:boolean;
    readonly blendSrcFactor:number;
    readonly blendDstFactor:number;
    readonly blendOp:number;
    readonly blendColor:[number, number, number, number];
    readonly blendSrcFactorRGB:number;
    readonly blendDstFactorRGB:number;
    readonly blendOpRGB:number;
    readonly blendSrcFactorAlpha:number;
    readonly blendDstFactorAlpha:number;
    readonly blendOpAlpha:number;
    readonly stencil:boolean;
    readonly stencilFailOp:number;
    readonly stencilDepthFailOp:number;
    readonly stencilPassOp:number;
    readonly stencilCmpFunc:number;
    readonly stencilReadMask:number;
    readonly stencilWriteMask:number;
    readonly stencilRef:number;
    readonly frontStencilFailOp:number;
    readonly frontStencilDepthFailOp:number;
    readonly frontStencilPassOp:number;
    readonly frontStencilCmpFunc:number;
    readonly frontStencilReadMask:number;
    readonly frontStencilWriteMask:number;
    readonly frontStencilRef:number;
    readonly backStencilFailOp:number;
    readonly backStencilDepthFailOp:number;
    readonly backStencilPassOp:number;
    readonly backStencilCmpFunc:number;
    readonly backStencilReadMask:number;
    readonly backStencilWriteMask:number;
    readonly backStencilRef:number;
    readonly depthCmpFunc:number;
    readonly depthWriteEnabled:boolean;
    readonly cullFaceEnabled:boolean;
    readonly cullFace:number;
    readonly scissorTestEnabled:boolean;
    constructor(args) {
        this.name = args;
        this.blend = args.blend || false;
        this.blendSrcFactor = parseBlend(args.blendSrcFactor || 'One');
        this.blendDstFactor = parseBlend(args.blendSrcFactor || 'Zero');
        this.blendOp = parseBlendOp(args.blendOp || 'Add');
        this.blendColor = [args.blendColor[0] || 1, args.blendColor[1] || 1, args.blendColor[2] || 1, args.blendColor[3] || 1];
        this.blendSrcFactorRGB = parseBlend(args.blendSrcFactorRGB || 'One');
        this.blendDstFactorRGB = parseBlend(args.blendSrcFactorRGB || 'Zero');
        this.blendOpRGB = parseBlendOp(args.blendOpRGB || 'Add');
        this.blendSrcFactorAlpha = parseBlend(args.blendSrcFactorAlpha || 'One');
        this.blendDstFactorAlpha = parseBlend(args.blendDstFactorAlpha || 'Zero');
        this.blendOpAlpha = parseBlendOp(args.blendOpAlpha || 'Add');

        this.stencil = args.stencil || false;
        this.stencilFailOp = parseStencilOp(args.stencilFailOp || 'Keep');
        this.stencilDepthFailOp = parseStencilOp(args.stencilDepthFailOp || 'Keep');
        this.stencilPassOp = parseStencilOp(args.stencilPassOp || 'Keep');
        this.stencilCmpFunc = parseCompareFunc(args.stencilCmpFunc || 'Always');
        this.stencilReadMask = args.stencilReadMask !== void 0 ? Number(args.stencilReadMask) : 0xFF;
        this.stencilWriteMask = args.stencilWriteMask !== void 0 ? Number(args.stencilWriteMask) : 0xFF;
        this.stencilRef = args.stencilRef || 0;

        this.frontStencilFailOp = parseStencilOp(args.frontStencilFailOp || 'Keep');
        this.frontStencilDepthFailOp = parseStencilOp(args.frontStencilDepthFailOp || 'Keep');
        this.frontStencilPassOp = parseStencilOp(args.frontStencilPassOp || 'Keep');
        this.frontStencilCmpFunc = parseCompareFunc(args.frontStencilCmpFunc || 'Always');
        this.frontStencilReadMask = args.frontStencilReadMask !== void 0 ? Number(args.frontStencilReadMask) : 0xFF;
        this.frontStencilWriteMask = args.frontStencilWriteMask !== void 0 ? Number(args.frontStencilWriteMask) : 0xFF;
        this.frontStencilRef = args.frontStencilRef || 0;

        this.backStencilFailOp = parseStencilOp(args.backStencilFailOp || 'Keep');
        this.backStencilDepthFailOp = parseStencilOp(args.backStencilDepthFailOp || 'Keep');
        this.backStencilPassOp = parseStencilOp(args.backStencilPassOp || 'Keep');
        this.backStencilCmpFunc = parseCompareFunc(args.backStencilCmpFunc || 'Always');
        this.backStencilReadMask = args.backStencilReadMask !== void 0 ? Number(args.backStencilReadMask) : 0xFF;
        this.backStencilWriteMask = args.backStencilWriteMask !== void 0 ? Number(args.backStencilWriteMask) : 0xFF;
        this.backStencilRef = args.backStencilRef || 0;

        this.depthCmpFunc = parseCompareFunc(args.depthCmpFunc || 'Always');
        this.depthWriteEnabled = args.depthWriteEnabled || false;
        this.cullFaceEnabled = args.cullFaceEnabled || false;
        this.cullFace = parseCullFace(args.cullFace || 'Back');
        this.scissorTestEnabled = args.scissorTestEnabled || false;
    }
    fork(overwriteData:any) {
        return new PipelineState(this);
    }
}

abstract class Shader {
    shader:WebGLShader;
    constructor(gl:WebGLRenderingContext, name, source, type) {
        const sh = gl.createShader(type);
        gl.shaderSource(sh, source);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
            console.error('Failed to compile shader:\n' + gl.getShaderInfoLog(sh));
        }
        this.shader = sh;
    }
}

class VertexShader extends Shader {
    constructor(gl, name, source) {
        super(gl, name, source, gl.VERTEX_SHADER);
    }
}

class FragmentShader extends Shader {
    constructor(gl, name, source) {
        super(gl, name, source, gl.FRAGMENT_SHADER);
    }
}

interface Attribute {

}

class Program {
    readonly gl:WebGLRenderingContext;
    readonly vertexShader:VertexShader;
    readonly fragmentShader:FragmentShader;
    readonly program:WebGLProgram;
    readonly attributes:{[code: string]: Attribute;};
    constructor(gl, name, vs, fs) {
        const prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            console.error('Failed to link shader program!');
        }
        this.vertexShader = vs;
        this.fragmentShader = fs;
        this.gl = gl;
        this.program = prog;
        const attributes:{[code: string]: Attribute;} = {};
        const numActiveAttributes:number = gl.getProgramParameter(prog, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; numActiveAttributes >= i; i++) {
            const activeAttribute:WebGLActiveInfo = gl.getActiveAttrib(prog, i);
            attributes[activeAttribute.name] = {
                name: activeAttribute.name,
                size: activeAttribute.size,
                type: activeAttribute.type,
                location: gl.getAttribLocation(prog, activeAttribute.name)
            };
        }
        this.attributes = attributes;
        
    }
}

/**
 * buffer and texture data usage hint
 */
export enum Usage {
    /** data is immutable, cannot be modified after creation */
    Immutable = GL.STATIC_DRAW,
    /** data is updated infrequently */
    Dynamic = GL.DYNAMIC_DRAW,
    /** data is overwritten each frame */
    Stream = GL.STREAM_DRAW,
}

class Buffer {
    readonly gl:WebGLRenderingContext;
    readonly buffer:WebGLBuffer;
    readonly bindTarget:number;
    readonly bindingParam:number;
    constructor(gl:WebGLRenderingContext, name:string, bindTarget:number, bindingParam:number) {
        this.gl = gl;
        this.buffer = gl.createBuffer();
        this.bindTarget = bindTarget;
        this.bindingParam = bindingParam;
    }
    uploadData(data:Float32Array, usage:Usage) {
        console.error('Not implemented yet.');
        return this;
    }
}

class IndexBuffer extends Buffer {
    constructor(gl:WebGLRenderingContext, name:string) {
        super(gl, name, gl.ELEMENT_ARRAY_BUFFER, gl.ELEMENT_ARRAY_BUFFER_BINDING);
    }
}

class VertexBuffer extends Buffer {
    constructor(gl:WebGLRenderingContext, name:string) {
        super(gl, name, gl.ARRAY_BUFFER, gl.ARRAY_BUFFER_BINDING);
    }
}

class Texture {

}

class ColorAttachment {
    readonly texture:Texture;
    readonly mipLevel:number;
    readonly slice:number;
    readonly loadAction:LoadAction;
    readonly clearColor:[number, number, number, number];
    
    constructor(texture?:Texture, mipLevel?:number, slice?:number, loadAction?:LoadAction, clearColor?:[number, number, number, number]) {
        this.texture = texture;
        this.mipLevel = mipLevel || 0;
        this.slice = slice || 0;
        this.loadAction = loadAction !== void 0 ? loadAction : LoadAction.Clear;
        this.clearColor = (clearColor || [0.0, 0.0, 0.0, 1.0])  as [number, number, number, number];
    }
}

class DepthAttachment {
    texture: Texture;
    loadAction: LoadAction;
    clearDepth: number;
    clearStencil: number;

    constructor(texture?:Texture, loadAction?:LoadAction = LoadAction.Clear, clearDepth?:number = 1, clearStencil?:number = 0) {
        this.texture = texture;
        this.loadAction = loadAction;
        this.clearDepth = clearDepth;
        this.clearStencil = clearStencil;
    }
}

class Pass {
    readonly colorAttachments:ColorAttachment[] = [];
    readonly depthAttachment:DepthAttachment;
    readonly storeAction:StoreAction;
    constructor(colorAttachments:ColorAttachment[], depthAttachment:DepthAttachment, storeAction:StoreAction) {
        if (!colorAttachments) {
            this.colorAttachments.push(new ColorAttachment());
        }
        else {
            this.colorAttachments.push.apply(this.colorAttachments, colorAttachments);
        }
        this.depthAttachment = depthAttachment;
        this.storeAction = storeAction !== void 0 ? storeAction : StoreAction.DontCare;
    }
}

class Pipeline {
    program:Program;
    state:PipelineState;
}

class DrawState {
    readonly pipeline:Pipeline;
    readonly mesh:Mesh;
    readonly textures:Texture[];
    readonly inputLayout:InputLayout;

    constructor(pipeline, mesh, inputLayout, textures) {
        this.pipeline = pipeline;
        this.mesh = mesh;
        this.textures = textures;
        this.inputLayout = inputLayout;
    }
}
class Mesh {
    readonly primitiveType:PrimitiveType;
    readonly vertexBuffers:VertexBuffer[];
    readonly indexBuffer?:IndexBuffer;
    readonly indexFormat?:IndexFormat;
    readonly indexSize?:number;
    readonly meshAttributes?:MeshAttribute[];
}

interface MeshAttribute {
    name:string;
    stride:number;
    offset:number;
    size:number;
    type:number;
    slot:number;
}

interface VertexAttributes {
    name:string;
    location:number;
    index:number;
    stride:number;
    offset:number;
    size:number;
    type:number;
    slot:number;
}

class InputLayout {
    readonly vertexAttributes:VertexAttributes[];
    constructor(gl:WebGLRenderingContext, name:string, progam, buffers, attrOptions:AttrOption[]) {
        const offsets = [];
        const vertexAttributes:VertexAttributes[] = [];
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
            vertexAttributes.push({name, index, location, stride, offset, type, size, slot});
        });
        this.vertexAttributes = vertexAttributes;
    }
}


interface AttrOption {
    name:string;
    offset?:number;
    stride?:number;
    size?:number;
    slot?:number;
}

interface BufferOptions {
    name?:string;
    data: number[];
    layout:AttrOption[];
    usage?:string;
}

interface IndexBufferOptions {
    name?:string;
    data: number[];
    layout:AttrOption[];
    usage?:string;
}

interface PassOptions {
    program:string;
    buffers:BufferOptions[];
    indexBuffer?:IndexBufferOptions;
    state?:any;
    mesh?:any;
}

interface GLOptions {

}

interface GfxOptions {
    options?:GLOptions;
    canvas:HTMLCanvasElement;
    passes?:{[index: string]:PassOptions};
    shaderData:any;
}

interface GraphicsDevice {
    start(updateFn:(ctx:GraphicsContext) => void):GraphicsDevice;
}

interface GraphicsContext {
    readonly width:number;
    readonly height:number;
    setViewport(x:number, y:number, width:number, height:number, minDepth?:number, maxDepth?:number):GraphicsContext;
    beginPass(pass:Pass):GraphicsContext;
    setConstant(name:string, value:any):GraphicsContext;
    setState(st:State):GraphicsContext;
    draw(start:number, count:number):GraphicsContext;
}
export default function createGfx(args:GfxOptions):GraphicsDevice {
    const canvas = args.canvas;
    const gl:WebGLRenderingContext = (canvas.getContext('webgl', args.options) || canvas.getContext('experimental-webgl', args.options)) as WebGLRenderingContext;
    let fn:(ctx:GraphicsContext) => void;
    let pass:Pass;
    let state:State;

    // state vars
    let blend = false;
    let blendSrcFactor = parseBlend('One');
    let blendDstFactor = parseBlend('Zero');
    let blendOp = parseBlendOp('Add');
    let colorWriteMask = [true, true, true, true];
    let blendColor = [1, 1, 1, 1];
    let blendSrcFactorRGB = parseBlend('One');
    let blendDstFactorRGB = parseBlend('Zero');
    let blendOpRGB = parseBlendOp('Add');
    let blendSrcFactorAlpha = parseBlend('One');
    let blendDstFactorAlpha = parseBlend('Zero');
    let blendOpAlpha = parseBlendOp('Add');

    let stencil = false;
    let stencilFailOp = parseStencilOp('Keep');
    let stencilDepthFailOp = parseStencilOp('Keep');
    let stencilPassOp = parseStencilOp('Keep');
    let stencilCmpFunc = parseCompareFunc('Always');
    let stencilReadMask = 0xFF;
    let stencilWriteMask = 0xFF;
    let stencilRef = 0;

    let frontStencilFailOp = parseStencilOp('Keep');
    let frontStencilDepthFailOp = parseStencilOp('Keep');
    let frontStencilPassOp = parseStencilOp('Keep');
    let frontStencilCmpFunc = parseCompareFunc('Always');
    let frontStencilReadMask = 0xFF;
    let frontStencilWriteMask = 0xFF;
    let frontStencilRef = 0;

    let backStencilFailOp = parseStencilOp('Keep');
    let backStencilDepthFailOp = parseStencilOp('Keep');
    let backStencilPassOp = parseStencilOp('Keep');
    let backStencilCmpFunc = parseCompareFunc('Always');
    let backStencilReadMask = 0xFF;
    let backStencilWriteMask = 0xFF;
    let backStencilRef = 0;

    let depthCmpFunc = parseCompareFunc('Always');
    let depthWriteEnabled = false;
    let cullFaceEnabled = false;
    let cullFace = parseCullFace('Back');
    let scissorTestEnabled = false;

    function applyState(st:State, force:boolean) {
        if (force || state !== st) {
            const state = st;
            // apply depth-stencil state changes
            if (force || (depthCmpFunc != depthCmpFunc)) {
                depthCmpFunc = state.depthCmpFunc;
                gl.depthFunc(state.depthCmpFunc);
            }
            if (force || (depthWriteEnabled != state.depthWriteEnabled)) {
                depthWriteEnabled = state.depthWriteEnabled;
                gl.depthMask(state.depthWriteEnabled);
            }
            if (force || (stencilEnabled != state.stencilEnabled)) {
                stencilEnabled = state.stencilEnabled;
                if (state.stencilEnabled) {
                    gl.enable(gl.STENCIL_TEST);
                } else {
                    gl.disable(gl.STENCIL_TEST);
                }
            }
            let sCmpFunc = state.frontStencilCmpFunc;
            let sReadMask = state.frontStencilReadMask;
            let sRef = state.frontStencilRef;
            if (force || 
                (frontStencilCmpFunc != sCmpFunc) ||
                (frontStencilReadMask != sReadMask) ||
                (frontStencilRef != sRef)) 
            {                
                frontStencilCmpFunc = sCmpFunc;
                frontStencilReadMask = sReadMask;
                frontStencilRef = sRef;
                gl.stencilFuncSeparate(gl.FRONT, sCmpFunc, sRef, sReadMask);
            }
            sCmpFunc = state.backStencilCmpFunc;
            sReadMask = state.backStencilReadMask;
            sRef = state.backStencilRef;
            if (force || 
                (backStencilCmpFunc != sCmpFunc) ||
                (backStencilReadMask != sReadMask) ||
                (backStencilRef != sRef)) 
            {                
                backStencilCmpFunc = sCmpFunc;
                backStencilReadMask = sReadMask;
                backStencilRef = sRef;
                gl.stencilFuncSeparate(gl.BACK, sCmpFunc, sRef, sReadMask);
            }
            let sFailOp = state.frontStencilFailOp;
            let sDepthFailOp = state.frontStencilDepthFailOp;
            let sPassOp = state.frontStencilPassOp;
            if (force ||
                (frontStencilFailOp != sFailOp) ||
                (frontStencilDepthFailOp != sDepthFailOp) ||
                (frontStencilPassOp != sPassOp)) 
            {    
                frontStencilFailOp = sFailOp;
                frontStencilDepthFailOp = sDepthFailOp;
                frontStencilPassOp = sPassOp;
                gl.stencilOpSeparate(gl.FRONT, sFailOp, sDepthFailOp, sPassOp);
            }
            sFailOp = state.backStencilFailOp;
            sDepthFailOp = state.backStencilDepthFailOp;
            sPassOp = state.backStencilPassOp;
            if (force ||
                (backStencilFailOp != sFailOp) ||
                (backStencilDepthFailOp != sDepthFailOp) ||
                (backStencilPassOp != sPassOp)) 
            {    
                backStencilFailOp = sFailOp;
                backStencilDepthFailOp = sDepthFailOp;
                backStencilPassOp = sPassOp;
                gl.stencilOpSeparate(gl.BACK, sFailOp, sDepthFailOp, sPassOp);
            }
            if (force || (frontStencilWriteMask != state.frontStencilWriteMask)) {
                frontStencilWriteMask = state.frontStencilWriteMask;
                gl.stencilMaskSeparate(gl.FRONT, state.frontStencilWriteMask)
            }
            if (force || (backStencilWriteMask != state.backStencilWriteMask)) {
                backStencilWriteMask = state.backStencilWriteMask;
                gl.stencilMaskSeparate(gl.BACK, state.backStencilWriteMask);
            }

            // apply blend state changes
            if (force || (blend != state.blend)) {
                blend = state.blend;
                if (blend) {
                    gl.enable(gl.BLEND);
                } else {
                    gl.disable(gl.BLEND);
                }
                
            }
            if (force ||
                (blendSrcFactorRGB != state.blendSrcFactorRGB) ||
                (blendDstFactorRGB != state.blendDstFactorRGB) ||
                (blendSrcFactorAlpha != state.blendSrcFactorAlpha) ||
                (blendDstFactorAlpha != state.blendDstFactorAlpha)) 
            {
                blendSrcFactorRGB = state.blendSrcFactorRGB;
                blendDstFactorRGB = state.blendDstFactorRGB;
                blendSrcFactorAlpha = state.blendSrcFactorAlpha;
                blendDstFactorAlpha = state.blendDstFactorAlpha;
                gl.blendFuncSeparate(state.blendSrcFactorRGB, 
                                        state.blendDstFactorRGB, 
                                        state.blendSrcFactorAlpha, 
                                        state.blendDstFactorAlpha);
            } 
            if (force ||
                (blendOpRGB != state.blendOpRGB) ||
                (blendOpAlpha != state.blendOpAlpha))
            {
                blendOpRGB = state.blendOpRGB;
                blendOpAlpha = state.blendOpAlpha;
                gl.blendEquationSeparate(state.blendOpRGB, state.blendOpAlpha);
            }
            if (force || 
                (colorWriteMask[0] != state.colorWriteMask[0]) ||
                (colorWriteMask[1] != state.colorWriteMask[1]) ||
                (colorWriteMask[2] != state.colorWriteMask[2]) ||
                (colorWriteMask[3] != state.colorWriteMask[3])) 
            {
                colorWriteMask[0] = state.colorWriteMask[0];
                colorWriteMask[1] = state.colorWriteMask[1];
                colorWriteMask[2] = state.colorWriteMask[2];
                colorWriteMask[3] = state.colorWriteMask[3];
                gl.colorMask(state.colorWriteMask[0], 
                                state.colorWriteMask[1], 
                                state.colorWriteMask[2],
                                state.colorWriteMask[3]);
            }
            if (force || 
                (blendColor[0] != state.blendColor[0]) ||
                (blendColor[1] != state.blendColor[1]) ||
                (blendColor[2] != state.blendColor[2]) ||
                (blendColor[3] != state.blendColor[3]))
            {
                blendColor[0] = state.blendColor[0];
                blendColor[1] = state.blendColor[1];
                blendColor[2] = state.blendColor[2];
                blendColor[3] = state.blendColor[3];
                gl.blendColor(state.blendColor[0],
                                state.blendColor[1],
                                state.blendColor[2],
                                state.blendColor[3]);
            }

            // apply rasterizer state
            if (force || (cullFaceEnabled != state.cullFaceEnabled)) {
                cullFaceEnabled = state.cullFaceEnabled;
                if (state.cullFaceEnabled) {
                    gl.enable(gl.CULL_FACE);
                } else {
                    gl.disable(gl.CULL_FACE);
                }     
            }
            if (force || (cullFace != state.cullFace)) {
                cullFace = state.cullFace;
                gl.cullFace(state.cullFace);
            }
            if (force || (scissorTestEnabled != state.scissorTestEnabled)) {
                scissorTestEnabled = state.scissorTestEnabled;
                if (state.scissorTestEnabled) {
                    gl.enable(gl.SCISSOR_TEST);
                } else {
                    gl.disable(gl.SCISSOR_TEST);
                }                         
            }
        }
    }

    const ctx:GraphicsContext = {
        get width():number {
            return gl.drawingBufferWidth;
        },
        get height():number {
            return gl.drawingBufferHeight;
        },
        setViewport(x:number, y:number, width:number, height:number, minDepth?:number, maxDepth?:number) {
            gl.viewport(x, y, width, height);
            if (minDepth !== void 0 && maxDepth !== void 0) {
                gl.depthRange(minDepth, maxDepth);
            }
            return this;
        },
        setState(st:State) {
            pass = void 0;
            applyState(st, !state);
            return this;
        },
        setProgram(prog:Program) {
            pass = void 0;
            program = prog;
            return this;
        }
        beginPass(pass:Pass) {
            const isDefaultPass:boolean = !pass.ColorAttachments[0].texture;
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
            scissorTestEnabled = false;
            colorWriteMask[0] = true;
            colorWriteMask[1] = true;
            colorWriteMask[2] = true;
            colorWriteMask[3] = true;
            depthWriteEnabled = true;
            frontStencilWriteMask = 0xFF;
            backStencilWriteMask = 0xFF;

            if (isDefaultPass) {
                let clearMask = 0;
                const col:ColorAttachment = pass.colorAttachments[0];
                const dep = pass.depthAttachment;
                if (col.loadAction === LoadAction.Clear) {
                    clearMask |= WebGLRenderingContext.COLOR_BUFFER_BIT;
                    gl.clearColor(col.clearColor[0], col.clearColor[1], col.clearColor[2], col.clearColor[3]);
                }
                if (dep.loadAction === LoadAction.Clear) {
                    clearMask |= WebGLRenderingContext.DEPTH_BUFFER_BIT|WebGLRenderingContext.STENCIL_BUFFER_BIT;
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
        },
        setConstant(name:string, value:any) {
            return this;
        },
        draw(start:number, count:number) {
        }
    };
    const states = {};
    const programs = {};
    const vertexShaders = {};
    const fragmentShaders = {};
    const passes = {};
    const update = () => {
        requestAnimationFrame(update);
        fn(ctx);
    }
    Object.keys(inPrograms).map(key => {
        const program = programs[key];
        const vs = vertexShaders[program.vs] || (vertexShaders[program.vs] = new VertexShader(gl, program.vs, vertexShaders[program.vs].source));
        const fs = fragmentShaders[program.fs] || (fragmentShaders[program.fs] = new FragmentShader(gl, program.fs, fragmentShaders[program.vs].source));
        programs[key] = new Program(gl, key, vs, fs);
    });
    if (passes) {
        Object.keys(args.passes).forEach(name => {
            const passData = args.passes[name];
            const state = states[passData.state] || new State(passData.state || {});
            const attrs = [];
            if (programs[passData.program.name]) {
                console.error(`Program named ${passData.program.name} already exist`);
            }
            const program = programs[passData.program] || programs[passData.program.name] || new Program(gl, passData.program.name, passData.program.vs, passData.program.fs);
            const buffers = [];
            if (passData.buffers) {
                buffers.push.apply(buffers, passData.buffers.map((buffer, idx) => {
                    attrs.push.apply(attrs, buffer.layout.map(attr => {
                        attr.slot = idx;
                        return attr;
                    }));
                    return new VertexBuffer(gl, buffer.name).uploadData(new Float32Array(buffer.data), buffer.usage);
                }));
            }
            const layout = new InputLayout(gl, '', program, buffers, attrs);
            const indexBuffer = passData.indexBuffer !== void 0 ? new IndexBuffer(gl, passData.indexBuffer.name).uploadData(new (passData.indexBuffer.type === 32 ? Uint32Array : Uint16Array)(passData.indexBuffer.data), passData.indexBuffer.usage) : void 0;
            passes[name] = new Pass(gl, name, state, program, buffers, indexBuffer, layout);
        });
    }
    return {
        start(updateFn:(ctx:GraphicsContext) => void):GraphicsDevice {
            if (!fn) {
                fn = updateFn;
                requestAnimationFrame(update);
            }
            return this;
        }
    };
}