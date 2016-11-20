const GL = WebGLRenderingContext;
export class Capabilities {
    readonly multipleRenderTargets: boolean;
    readonly floatTextures: boolean;
    readonly halfFloatTextures: boolean;
    readonly loseContext: boolean;
    readonly standardDerivatives: boolean;
    readonly vertexArrayObjects: boolean;
    readonly debugRendererInfo: boolean;
    readonly debugShaders: boolean;
    readonly compressedTextureS3TC: boolean;
    readonly depthTextures: boolean;
    readonly unsignedIntIndices: boolean;
    readonly anisotropicFiltering: boolean;
    readonly maxAnisotropyLevel: number;
    readonly compressedTextureATC: boolean;
    readonly instancedArrays: boolean;
    readonly compressedTexturePVRTC: boolean;

    readonly depthBuffer: boolean;
    readonly stencilBuffer: boolean;

    readonly textureUnits: boolean;
    readonly vertexShaderTextureUnits: boolean;
    readonly maxTextureSize: boolean;
    readonly maxCubeMapTextureSize: boolean;
    readonly maxVertexAttribs: boolean;
    readonly maxVaryingVectors: boolean;
    readonly maxVertexShaderUniforms: boolean;
    readonly maxFragmentShaderUniforms: boolean;
    readonly depthBufferSize: boolean;
    readonly stencilBufferSize: boolean;

    constructor(gl: WebGLRenderingContext) {
        this.multipleRenderTargets = hasExtension(gl, 'EXT_draw_buffers');
        this.halfFloatTextures = hasExtension(gl, 'OES_texture_half_float');
        this.loseContext = hasExtension(gl, 'WEBGL_lose_context');
        this.standardDerivatives = hasExtension(gl, 'OES_standard_derivatives');
        this.vertexArrayObjects = hasExtension(gl, 'OES_vertex_array_object');
        this.debugRendererInfo = hasExtension(gl, 'WEBGL_debug_renderer_info');
        this.debugShaders = hasExtension(gl, 'WEBGL_debug_shaders');
        this.compressedTextureS3TC = hasExtension(gl, 'WEBGL_compressed_texture_s3tc');
        this.compressedTextureATC = hasExtension(gl, 'WEBGL_compressed_texture_atc');
        this.compressedTexturePVRTC = hasExtension(gl, 'WEBGL_compressed_texture_pvrtc');
        this.depthTextures = hasExtension(gl, 'WEBGL_depth_texture');
        this.floatTextures = hasExtension(gl, 'OES_texture_float');
        this.unsignedIntIndices = hasExtension(gl, 'OES_element_index_uint');
        const extTfa = getExtension(gl, 'EXT_texture_filter_anisotropic');
        if (extTfa) {
            this.anisotropicFiltering = true;
            this.maxAnisotropyLevel = gl.getParameter(extTfa.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        } else {
            this.anisotropicFiltering = false;
            this.maxAnisotropyLevel = 1;
        }
        this.instancedArrays = hasExtension(gl, 'ANGLE_instanced_arrays');

        const attributes = gl.getContextAttributes();
        this.depthBuffer = attributes.depth;
        this.stencilBuffer = attributes.stencil;

        this.textureUnits = gl.getParameter(GL.MAX_TEXTURE_IMAGE_UNITS);
        this.vertexShaderTextureUnits = gl.getParameter(GL.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        this.maxTextureSize = gl.getParameter(GL.MAX_TEXTURE_SIZE);
        this.maxCubeMapTextureSize = gl.getParameter(GL.MAX_CUBE_MAP_TEXTURE_SIZE);
        this.maxVertexAttribs = gl.getParameter(GL.MAX_VERTEX_ATTRIBS);
        this.maxVaryingVectors = gl.getParameter(GL.MAX_VARYING_VECTORS);
        this.maxVertexShaderUniforms = gl.getParameter(GL.MAX_VERTEX_UNIFORM_VECTORS);
        this.maxFragmentShaderUniforms = gl.getParameter(GL.MAX_FRAGMENT_UNIFORM_VECTORS);
        this.depthBufferSize = gl.getParameter(GL.DEPTH_BITS);
        this.stencilBufferSize = gl.getParameter(GL.STENCIL_BITS);
    }
}
const vendorExtensions = ['', 'WEBKIT_', 'MOZ_'];
export const hasExtension = (gl: WebGLRenderingContext, name: string) => !!getExtension(gl, name);
export const getExtension = (gl: WebGLRenderingContext, name: string) => vendorExtensions.map(vendor => gl.getExtension(`${vendor}${name}`))[0];