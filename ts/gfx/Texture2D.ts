import { Texture } from './Texture';
import { PixelType } from './PixelType';
import { PixelFormat } from './PixelFormat';
import { GraphicsContext } from './GraphicsContext';
const GL = WebGLRenderingContext;
export class Texture2D extends Texture {
    private currentTaskId: number;
    readonly name;
    _width: number;
    _height: number;
    constructor(name: string, context: GraphicsContext) {
        super(name, context, GL.TEXTURE_2D, GL.TEXTURE_BINDING_2D, GL.TEXTURE_2D);
    }
    uploadFromUrl(src: string) {
        const taskManager = this.context.taskManager;

        const loadTextureTask = taskManager.createTask('LoadTexture');
        loadTextureTask.src = src;
        loadTextureTask.texture = this;

        const uploadTextureTask = taskManager.createTask('UploadTexture');
        uploadTextureTask.gl = this.context.gl;
        uploadTextureTask.glTexture = this.glTexture;
        uploadTextureTask.pixelFormat = this.pixelFormat;
        uploadTextureTask.pixelType = this.pixelType;
        uploadTextureTask.element = loadTextureTask.element;

        loadTextureTask.nextTask = uploadTextureTask;
        
        taskManager.startTask(loadTextureTask);
        this.currentTaskId = loadTextureTask.id;
        return loadTextureTask.id;
    }
    uploadElement(element: HTMLCanvasElement | HTMLImageElement | HTMLImageElement | ImageData): void {
        const previouseBind = this.internalPushBind();
        this.context.gl.texImage2D(this.textureTarget, 0, this.textureFormat, this.pixelFormat, this.pixelType, element);
        this.internalPopBind(previouseBind);
    }
    uploadPixelArray({width, height, data, pixelFormat = PixelFormat.Rgba, pixelType = PixelType.u8 }: UploadPixelArrayArguments): void {
        const previouseBind = this.internalPushBind();
        this._width = width;
        this._height = height;
        this.context.gl.texImage2D(this.textureTarget, 0, this.textureFormat, width, height, 0, pixelFormat, pixelType, data);
        this.internalPopBind(previouseBind);
    }
}
interface UploadPixelArrayArguments {
    width: number;
    height: number;
    data: ArrayBufferView;
    pixelFormat: PixelFormat;
    pixelType: PixelType;
}