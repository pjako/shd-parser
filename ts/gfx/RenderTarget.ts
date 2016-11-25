class RenderTarget {
    readonly name: string;
    readonly frameBuffer: WebGLFramebuffer;
    readonly 
    constructor(gl:WebGLRenderingContext, name:string) {
        this.frameBuffer = gl.createFramebuffer();
    }
}

