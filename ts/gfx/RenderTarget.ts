class RenderTarget {
    readonly name: string;
    readonly frameBuffer: WebGLFramebuffer;
    constructor(gl:WebGLRenderingContext, name:string) {
        this.frameBuffer = gl.createFramebuffer();
    }
}