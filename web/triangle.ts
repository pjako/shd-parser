import createGfx from '../ts/gfx';
import * as shaderData from './shaders/triangle.shd';
const device = createGfx({
    canvas: document.querySelector('#frontBuffer') as HTMLCanvasElement,
    shaderData: shaderData,
    passes: {
        Default: {
            colorAttachments: [{clearColor: [0.5, 0.5, 0.5, 1.0]}]
        }
    },
    piplineStates: {
        Overwrite: {
            depthCmpFunc: 'Always',
            depthWriteEnabled: false,
            cullFaceEnabled: false,
        }
    },
    pipelines: {
        Triangle: {
            primitiveType: 'triangle',
            program: 'Triangle',
            state: 'Overwrite'
        }
    },
    meshes: {
        Triangle: {
            vertexBuffers: [{
                data: [
                       0,  0.5, 0.5, 1, 0, 0,
                     0.5, -0.5, 0.5, 0, 1, 0,
                    -0.5, -0.5, 0.5, 0, 0, 1
                ],
                layout: [{name: 'position'}, {name: 'color0'}]
            }]
        }
    }
    drawStates: {
        Triangle: {
            pipeline: 'Triangle',
            mesh: 'Triangle'
        }
    }
}).start(ctx => {
    const {Default} = ctx.passes;
    const {Triangle} = ctx.drawStates;
    ctx
    .beginPass(Default)
    .setViewport(0, 0, ctx.width, ctx.height)
    .setDrawState(Triangle)
    .draw(0, 3)
    .endPass()
    .commitFrame();
});