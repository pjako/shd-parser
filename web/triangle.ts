import { createGraphicsContext, BatchLoadOptions, BlendFactor, CompareFunc, PrimitiveType } from '../ts/gfx.ts';
import * as shaderData from './shaders/triangle.shd';

createGraphicsContext({ canvas: '#frontBuffer' })
.batchLoad(shaderData as BatchLoadOptions)
.batchLoad({
    passes: {
        Default: {
            colorAttachments: [{ clearColor: [0.5, 0.5, 0.5, 1.0] }]
        }
    },
    pipelineStates: {
        Overwrite: {
            depthCmpFunc: CompareFunc.Always,
            depthWriteEnabled: false,
            cullFaceEnabled: false,
        }
    },
    pipelines: {
        Triangle: {
            program: 'Triangle',
            pipelineState: 'Overwrite'
        }
    },
    meshes: {
        Triangle: {
            primitiveType: PrimitiveType.Triangles,
            vertexBuffers: [{
                data: [
                       0,  0.5, 0.5, 1, 0, 0,
                     0.5, -0.5, 0.5, 0, 1, 0,
                    -0.5, -0.5, 0.5, 0, 0, 1
                ],
                layout: [{ name: 'position' }, { name: 'color0' }]
            }]
        }
    },
    drawStates: {
        Triangle: {
            pipeline: 'Triangle',
            mesh: 'Triangle'
        }
    },
}).onFrame(ctx => {
    debugger;
    const {Default} = ctx.passes;
    const {Triangle} = ctx.drawStates;
    ctx
        .beginPass(Default)
        .setDrawState(Triangle)
        .draw(0, 3)
        .endPass()
        .commitFrame();
});