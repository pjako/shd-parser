import { GraphicsContext } from './GraphicsContext';
import { PixelType } from './PixelType';
import { PixelFormat } from './PixelFormat';

export class Texture {
    readonly name: string;
    readonly context: GraphicsContext;
    readonly bindTarget: number;
    readonly bindingParam: number;
    readonly textureTarget: number;
    readonly glTexture: WebGLTexture;
    readonly pixelFormat: PixelFormat;
    readonly pixelType: PixelType;
    textureFormat: number;
    constructor(name: string, context: GraphicsContext, bindTarget, bindingParam, textureTarget) {
        this.name = name;
        this.context = context;
        this.bindTarget = bindTarget;
        this.bindingParam = bindingParam;
        this.textureTarget = textureTarget;
        this.glTexture = context.gl.createTexture();
    }
    internalPushBind(): WebGLTexture {
        const previouseBind = this.context.gl.getParameter(this.bindingParam);
        this.context.gl.bindTexture(this.bindTarget, this.bindingParam);
        return previouseBind;
    }
    internalPopBind(oldBind: WebGLTexture): void {
        this.context.gl.bindTexture(this.bindTarget, oldBind);
    }
}