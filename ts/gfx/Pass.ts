import {Texture} from './Texture';
export class Pass {
    readonly colorAttachments: ColorAttachment[] = [];
    readonly depthAttachment: DepthAttachment;
    readonly storeAction: StoreAction;
    constructor({colorAttachments, depthAttachment, storeAction}: PassOptions) {
        if (!colorAttachments) {
            this.colorAttachments.push(new ColorAttachment());
        }
        else {
            colorAttachments.forEach(cA => this.colorAttachments.push(new ColorAttachment(cA)));
        }
        this.depthAttachment = new DepthAttachment(depthAttachment);
        this.storeAction = storeAction !== void 0 ? storeAction : StoreAction.DontCare;
    }
}
export interface TextureOptions {

}
export interface ColorAttachmentsOptions {
    texture?: TextureOptions;
    mipLevel?: number;
    slice?: number;
    loadAction?: LoadAction;
    clearColor?: [number, number, number, number];
}

export interface DepthAttachmentsOptions {
    texture?: Texture;
    loadAction?: LoadAction;
    clearDepth?: number;
    clearStencil?: number;
}

export interface PassOptions {
    colorAttachments?: ColorAttachmentsOptions[];
    depthAttachment?: DepthAttachmentsOptions;
    storeAction?: StoreAction;
}

export class ColorAttachment {
    readonly texture: Texture;
    readonly mipLevel: number;
    readonly slice: number;
    readonly loadAction: LoadAction;
    readonly clearColor: [number, number, number, number];

    constructor({texture, mipLevel = 0, slice = 0, loadAction = LoadAction.Clear, clearColor}: ColorAttachmentsOptions = {}) {
        this.texture = texture;
        this.mipLevel = mipLevel || 0;
        this.slice = slice || 0;
        this.loadAction = loadAction !== void 0 ? loadAction : LoadAction.Clear;
        if (clearColor) {
            this.clearColor = [clearColor[0] || 0.0, clearColor[1] || 0.0, clearColor[2] || 0.0, clearColor[3] || 1.0];
        } else {
            this.clearColor = [0.0, 0.0, 0.0, 1.0];
        }
    }
}

export class DepthAttachment {
    readonly texture: Texture;
    readonly loadAction: LoadAction;
    readonly clearDepth: number;
    readonly clearStencil: number;

    constructor({ texture, loadAction = LoadAction.Clear, clearDepth = 1, clearStencil = 0 }: DepthAttachmentsOptions = {}) {
        this.texture = texture;
        this.loadAction = loadAction;
        this.clearDepth = clearDepth;
        this.clearStencil = clearStencil;
    }
}

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