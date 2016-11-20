import { createGraphicsContext, BatchLoadOptions, BlendFactor, CompareFunc, PrimitiveType } from '../../ts/gfx';
import * as shaderData from './shaders.shd';

createGraphicsContext({ canvas: '#frontBuffer' })
.batchLoad(shaderData as BatchLoadOptions)
.batchLoad({
    passes: {
        TrianglePass: {
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
                attributes: ['position', 'color0']
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
    const {TrianglePass} = ctx.passes;
    const {Triangle} = ctx.drawStates;
    ctx
        .beginPass(TrianglePass)
        .setDrawState(Triangle)
        .draw(0, 3)
        .endPass()
        .commitFrame();
});