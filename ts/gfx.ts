import {GraphicsContext, GraphicsContextOptions} from './gfx/GraphicsContext.ts';
export * from './gfx/GraphicsContext.ts';
export * from './gfx/PipelineState.ts';
export * from './gfx/Mesh.ts';
export function createGraphicsContext(options:GraphicsContextOptions) {
    return new GraphicsContext(options);
}