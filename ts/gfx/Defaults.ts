import { TextureAddressMode , TextureMinFilter, TextureMagFilter } from './SamplerState';
import { BatchLoadOptions } from './GraphicsContext';
const _defaults: BatchLoadOptions = {
    passes: {
        DefaultPass: {
            colorAttachments: [{ clearColor: [0.5, 0.5, 0.5, 1.0] }]
        }
    },
    pipelineStates: {
        Default: {}
    },
    samplerStates: {
        AnisotropicClamp: {
            addressU: TextureAddressMode.Clamp,
            addressV: TextureAddressMode.Clamp,
            maxAnisotropy: 4,
        },
        AnisotropicWrap: {
            addressU: TextureAddressMode.Wrap,
            addressV: TextureAddressMode.Wrap,
            maxAnisotropy: 4,
        },
        LinearClamp: {
            addressU: TextureAddressMode.Clamp,
            addressV: TextureAddressMode.Clamp,
            minFilter: TextureMinFilter.Linear,
            magFilter: TextureMagFilter.Linear,
        },
        LinearWrap: {
            addressU: TextureAddressMode.Wrap,
            addressV: TextureAddressMode.Wrap,
            minFilter: TextureMinFilter.Linear,
            magFilter: TextureMagFilter.Linear,
        },
        PointClamp: {
            addressU: TextureAddressMode.Clamp,
            addressV: TextureAddressMode.Clamp,
            minFilter: TextureMinFilter.Point,
            magFilter: TextureMagFilter.Point,
        },
        PointWrap: {
            addressU: TextureAddressMode.Wrap,
            addressV: TextureAddressMode.Wrap,
            minFilter: TextureMinFilter.Point,
            magFilter: TextureMagFilter.Point,
        },
    }
};

export default _defaults;