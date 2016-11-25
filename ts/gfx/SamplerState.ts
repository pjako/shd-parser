const GL = WebGLRenderingContext;

const capitalizeFirstLetter: (str: any) => string = str => str[0].toUpperCase() + str.substring(1);
const isNumber = str => typeof str === 'number';

interface SamplerStateArguments {
    name: string;
    addressU: TextureAddressMode | string;
    addressV: TextureAddressMode | string;
    minFilter: TextureMinFilter | string;
    magFilter: TextureMagFilter | string;
    maxAnisotropy: number;
}

export class SamplerState {
    readonly name: string;
    readonly addressU: TextureAddressMode;
    readonly addressV: TextureAddressMode;
    readonly minFilter: TextureMinFilter;
    readonly magFilter: TextureMagFilter;
    readonly maxAnisotropy: number;
    constructor({ name,
        addressU = TextureAddressMode.Wrap,
        addressV = TextureAddressMode.Wrap,
        minFilter = TextureMinFilter.Linear,
        magFilter = TextureMagFilter.Linear,
        maxAnisotropy = 1 }: SamplerStateArguments) {
            capitalizeFirstLetter(addressU)
            this.name = name;
            this.addressU = (isNumber(addressU) ? addressU : TextureAddressMode[capitalizeFirstLetter(addressU)]) as TextureAddressMode;
            this.addressU = (isNumber(addressV) ? addressV : TextureAddressMode[capitalizeFirstLetter(addressV)]) as TextureAddressMode;
            this.minFilter = (isNumber(addressV) ? addressV : TextureMinFilter[capitalizeFirstLetter(addressV)]) as TextureMinFilter;
            this.magFilter = (isNumber(addressV) ? addressV : TextureMagFilter[capitalizeFirstLetter(addressV)]) as TextureMagFilter;
            this.maxAnisotropy = maxAnisotropy;
    }
}
export interface SamplerStateOptions {
    readonly addressU?: TextureAddressMode;
    readonly addressV?: TextureAddressMode;
    readonly minFilter?: TextureMinFilter;
    readonly magFilter?: TextureMagFilter;
    readonly maxAnisotropy?: number;
}

/**
 * Defines modes for addressing texels using texture coordinates outside of
 * the typical range of 0.0 to 1.0.
 */
export enum TextureAddressMode {
    /**
     * Texture coordinates outside the range [0.0, 1.0] are set to the texture
     * color at 0.0 or 1.0, respectively.
     */
    Clamp = GL.CLAMP_TO_EDGE,
    /**
     * Similar to Wrap, except that the texture is flipped at every integer
     * junction.
     * 
     * For values between 0 and 1, for example, the texture is addressed
     * normally; between 1 and 2, the texture is
     * flipped (mirrored); between 2 and 3, the texture is normal again, and so
     * on.
     */
    Mirror = GL.MIRRORED_REPEAT,
    /**
     * Tile the texture at every integer junction.
     * 
     * For example, for u values between 0 and 3, the texture is repeated three
     * times.
     * No mirroring is performed.
     */
    Wrap = GL.REPEAT,
}

/** Defines filtering types for minification during texture sampling. */
export enum TextureMinFilter {
    /** Use linear filtering for minification. */
    Linear = GL.LINEAR,
    /** Use point filtering for minification. */
    Point = GL.NEAREST,
}

/** Defines filtering types for magnification during texture sampling. */
export enum TextureMagFilter {
    /** Use linear filtering for magnification. */
    Linear = GL.LINEAR,
    /** Use point filtering for magnification. */
    Point = GL.NEAREST,
    /** Use point filtering to expand, and point filtering between mipmap levels. */
    PointMipPoint = GL.NEAREST_MIPMAP_NEAREST,
    /** Use point filtering to expand, and linear filtering between mipmap levels. */
    PointMipLinear = GL.NEAREST_MIPMAP_LINEAR,
    /** Use linear filtering to expand, and point filtering between mipmap levels. */
    LinearMipPoint = GL.LINEAR_MIPMAP_NEAREST,
    /** Use linear filtering to expand, and linear filtering between mipmap levels. */
    LinearMipLinear = GL.LINEAR_MIPMAP_LINEAR,
}