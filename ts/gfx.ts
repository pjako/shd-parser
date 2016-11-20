import {GraphicsContext, GraphicsContextOptions} from './gfx/GraphicsContext';
export * from './gfx/GraphicsContext';
export * from './gfx/PipelineState';
export * from './gfx/Mesh';
export function createGraphicsContext(options:GraphicsContextOptions) {
    return new GraphicsContext(options);
}