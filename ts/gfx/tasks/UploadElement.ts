import { Task } from './Task';
import { TaskType } from './TaskType';
import { ExecutionType } from './ExecutionType';
import { Texture2D } from '../Texture2D';

export class UploadElement extends Task {
    img: HTMLImageElement;
    texture: Texture2D;
    glTexture: WebGLTexture;
    gl: WebGLRenderingContext;

    constructor() {
        super(TaskType.LoadTexture2D, ExecutionType.async);
        this.clear();
    }

    execute(ctx, taskBefore, parentTask, otherTasks, addTask) {
        this.texture.uploadElement(this.img);
    }
    textureLoaded() {
        if (this.id < 0) {
            return;
        }
    }
    clear() {
        this.img = void 0;
        this.glTexture = void 0;
        this.gl = void 0;
    }
}