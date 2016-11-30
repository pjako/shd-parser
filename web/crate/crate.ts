import { createGraphicsContext, BatchLoadOptions, BlendFactor, CompareFunc, PrimitiveType } from '../../ts/gfx';
import * as shaderData from './shaders.shd';
import * as Mat4 from './mat4';

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

const vertices = [
    // Front face
    -1.0, -1.0,  1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,
    1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0,  1.0,  1.0,
    1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
];
const textureCoords = new Float32Array([
    // Front face
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,

    // Back face
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Top face
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,

    // Bottom face
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,

    // Right face
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,

    // Left face
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
]);
const indicies = [
    0, 1, 2,      0, 2, 3,    // Front face
    4, 5, 6,      4, 6, 7,    // Back face
    8, 9, 10,     8, 10, 11,  // Top face
    12, 13, 14,   12, 14, 15, // Bottom face
    16, 17, 18,   16, 18, 19, // Right face
    20, 21, 22,   20, 22, 23  // Left face
];
const mvMatrix = Mat4.create();
const mvMatrixStack = [];
const pMatrix = Mat4.create();
let xRot = 0;
let yRot = 0;
let zRot = 0;

    var lastTime = 0;

function animate() {
    var timeNow = Date.now();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        xRot += (90 * elapsed) / 1000.0;
        yRot += (90 * elapsed) / 1000.0;
        zRot += (90 * elapsed) / 1000.0;
    }
    lastTime = timeNow;
}

const context = createGraphicsContext({ canvas: '#frontBuffer' })
context.batchLoad(shaderData as BatchLoadOptions)
const creationTask = context.batchLoad({
    passes: {
        DirectDraw: {
            colorAttachments: [{ clearColor: [0.5, 0.5, 0.5, 1.0] }]
        }
    },
    pipelineStates: {
        Opaque: {
            depthCmpFunc: CompareFunc.LessEqual,
            depthWriteEnabled: true,
            cullFaceEnabled: true
        }
    },
    pipelines: {
        SimpleObject: {
            program: 'Simple',
            pipelineState: 'Opaque'
        }
    },
    meshes: {
        Crate: {
            primitiveType: PrimitiveType.Triangles,
            indexBuffer: {
                data: indicies
            },
            vertexBuffers: [{
                data: vertices,
                attributes: ['position']
            }, {
                data: textureCoords,
                attributes: ['texcoord0']
            }]
        },
    },
    drawStates: {
        Crate: {
            pipeline: 'SimpleObject',
            mesh: 'Crate',
            textures: {
                textureSampler: 'CreateTexture'
            }
        }
    },
    textures: {
        CreateTexture: {
            src: './create1_diffuse.png'
        }
    }
});
context.onFrame(ctx => {
    if (!ctx.taskDone(creationTask)) {
        // Do nothing till everything is created
        return;
    }

    const { DirectDraw } = ctx.passes;
    const { Crate } = ctx.drawStates;
    animate();
    Mat4.perspective(pMatrix, 45, ctx.width / ctx.height, 0.1, 100.0);
    Mat4.setIdentity(mvMatrix);

    Mat4.translateSelf(mvMatrix, [0.0, 0.0, -5.0]);

    Mat4.rotateSelf(mvMatrix, degToRad(xRot), [1, 0, 0]);
    Mat4.rotateSelf(mvMatrix, degToRad(yRot), [0, 1, 0]);
    Mat4.rotateSelf(mvMatrix, degToRad(zRot), [0, 0, 1]);
    ctx
        .beginPass(DirectDraw)
        .setDrawState(Crate)
        .setConstant('modelViewMatrix', mvMatrix)
        .setConstant('perspectiveMatrix', pMatrix)
        .draw(0, 36)
        .endPass()
        .commitFrame();
});