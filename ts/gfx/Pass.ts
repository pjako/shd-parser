import {Texture} from './Texture';
export class Pass {
    readonly colorAttachments: ColorAttachment[] = [];
    readonly depthAttachments: DepthAttachment;
    readonly storeAction: StoreAction;
    constructor({colorAttachments, depthAttachments, storeAction}: PassOptions) {
        if (!colorAttachments) {
            this.colorAttachments.push(new ColorAttachment());
        }
        else {
            this.colorAttachments.push.apply(this.colorAttachments, colorAttachments.map(ca => new ColorAttachment(ca)));
        }
        // this.depthAttachment = depthAttachments;
        this.storeAction = storeAction !== void 0 ? storeAction : StoreAction.DontCare;
    }
}

export interface ColorAttachmentsOptions {
    clearColor: [number, number, number, number];
}

export interface DepthAttachmentsOptions {
    
}

export interface PassOptions {
    colorAttachments: ColorAttachmentsOptions[];
    depthAttachments?: DepthAttachmentsOptions[];
    storeAction?: StoreAction;
}

export class ColorAttachment {
    readonly texture: Texture;
    readonly mipLevel: number;
    readonly slice: number;
    readonly loadAction: LoadAction;
    readonly clearColor: [number, number, number, number];

    constructor(texture?: Texture, mipLevel?: number, slice?: number, loadAction?: LoadAction, clearColor?: [number, number, number, number]) {
        this.texture = texture;
        this.mipLevel = mipLevel || 0;
        this.slice = slice || 0;
        this.loadAction = loadAction !== void 0 ? loadAction : LoadAction.Clear;
        this.clearColor = (clearColor || [0.0, 0.0, 0.0, 1.0]) as [number, number, number, number];
    }
}

export class DepthAttachment {
    texture: Texture;
    loadAction: LoadAction;
    clearDepth: number;
    clearStencil: number;

    constructor(texture?: Texture, loadAction: LoadAction = LoadAction.Clear, clearDepth: number = 1, clearStencil: number = 0) {
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