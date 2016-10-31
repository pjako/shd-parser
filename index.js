const slVersions = ['glsl100', 'glsl120', 'glsl330', 'glsles3', 'hlsl5', 'metal'];
const slSlangTypes = {
    'glsl100': 'ShaderLang::GLSL100',
    'glsl120': 'ShaderLang::GLSL120',
    'glsl330': 'ShaderLang::GLSL330',
    'glsles3': 'ShaderLang::GLSLES3',
    'hlsl5':   'ShaderLang::HLSL5',
    'metal':   'ShaderLang::Metal'
};
const isHLSL = {
    'glsl100': False,
    'glsl120': False,
    'glsl330': False,
    'glsles3': False,
    'hlsl5': True,
    'metal': False
};
const isMetal = {
    'glsl100': False,
    'glsl120': False,
    'glsl330': False,
    'glsles3': False,
    'hlsl5': False,
    'metal': True
};

const glslVersionNumber = {
    'glsl100': 100,
    'glsl120': 120,
    'glsl330': 330,
    'glsles3': 300,
    'hlsl5': None,
    'metal': None
};
const slMacros = {
    'glsl100': {
        'ORYOL_GLSL': '(1)',
        'ORYOL_HLSL': '(0)',
        'ORYOL_METALSL': '(0)',
        'ORYOL_GLSL_VERSION': '(100)',
        '_vertexid': '(0)',
        '_instanceid': '(0)',
        '_position': 'gl_Position',
        '_pointsize': 'gl_PointSize',
        '_color': 'gl_FragColor',
        '_color1': 'gl_FragColor',
        '_color2': 'gl_FragColor',
        '_color3': 'gl_FragColor',
        '_fragcoord': 'gl_FragCoord',
        '_const': 'const',
        '_func': '',
        'sampler3D': 'sampler2D',       // hack to hide invalid sampler types
        'sampler2DArray': 'sampler2D',  // hack to hide invalid sampler types
        'mul(m,v)': '(m*v)',
        'tex2D(s, t)': 'texture2D(s,t)',
        'tex3D(s, t)': 'vec4(0.0)',
        'tex2DArray(s, t)': 'vec4(0.0)',
        'texCUBE(s, t)': 'textureCube(s,t)',
        'tex2Dvs(s, t)': 'texture2D(s,t)',
        'tex3Dvs(s, t)': 'vec4(0.0)',
        'tex2DArrayvs(s, t)': 'vec4(0.0)',
    },
    'glsl120': {
        'ORYOL_GLSL': '(1)',
        'ORYOL_HLSL': '(0)',
        'ORYOL_METALSL': '(0)',
        'ORYOL_GLSL_VERSION': '(120)',
        '_vertexid': 'gl_VertexID',
        '_instanceid': 'gl_InstanceID',
        '_position': 'gl_Position',
        '_pointsize': 'gl_PointSize',
        '_color': 'gl_FragColor',
        '_color1': 'gl_FragColor',
        '_color2': 'gl_FragColor',
        '_color3': 'gl_FragColor',
        '_fragcoord': 'gl_FragCoord',
        '_const': 'const',
        '_func': '',
        'sampler3D': 'sampler2D',       // hack to hide invalid sampler types
        'sampler2DArray': 'sampler2D',  // hack to hide invalid sampler types
        'mul(m,v)': '(m*v)',
        'tex2D(s, t)': 'texture2D(s,t)',
        'tex3D(s, t)': 'vec4(0.0)',
        'tex2DArray(s, t)': 'vec4(0.0)',
        'texCUBE(s, t)': 'textureCube(s,t)',
        'tex2Dvs(s, t)': 'texture2D(s,t)',
        'tex3Dvs(s, t)': 'vec4(0.0)',
        'tex2DArrayvs(s, t)': 'vec4(0.0)',
    },
    'glsl330': {
        'ORYOL_GLSL': '(1)',
        'ORYOL_HLSL': '(0)',
        'ORYOL_METALSL': '(0)',
        'ORYOL_GLSL_VERSION': '(330)',
        '_vertexid': 'gl_VertexID',
        '_instanceid': 'gl_InstanceID',
        '_position': 'gl_Position',
        '_pointsize': 'gl_PointSize',
        '_color': '_FragColor',
        '_color1': '_FragColor1',
        '_color2': '_FragColor2',
        '_color3': '_FragColor3',
        '_fragcoord': 'gl_FragCoord',
        '_const': 'const',
        '_func': '',
        'mul(m,v)': '(m*v)',
        'tex2D(s, t)': 'texture(s,t)',
        'tex3D(s, t)': 'texture(s,t)',
        'tex2DArray(s, t)': 'texture(s,t)',
        'texCUBE(s, t)': 'texture(s,t)',
        'tex2Dvs(s, t)': 'texture(s,t)',
        'tex3Dvs(s, t)': 'texture(s,t)',
        'tex2DArrayvs(s, t)': 'texture(s,t)',
    },
    'glsles3': {
        'ORYOL_GLSL': '(1)',
        'ORYOL_HLSL': '(0)',
        'ORYOL_METALSL': '(0)',
        'ORYOL_GLSL_VERSION': '(300)',
        '_vertexid': 'gl_VertexID',
        '_instanceid': 'gl_InstanceID',
        '_position': 'gl_Position',
        '_pointsize': 'gl_PointSize',
        '_color': '_FragColor',
        '_color1': '_FragColor1',
        '_color2': '_FragColor2',
        '_color3': '_FragColor3',
        '_fragcoord': 'gl_FragCoord',
        '_const': 'const',
        '_func': '',
        'mul(m,v)': '(m*v)',
        'tex2D(s, t)': 'texture(s,t)',
        'tex3D(s, t)': 'texture(s,t)',
        'tex2DArray(s, t)': 'texture(s,t)',
        'texCUBE(s, t)': 'texture(s,t)',
        'tex2Dvs(s, t)': 'texture(s,t)',
        'tex3Dvs(s, t)': 'texture(s,t)',
        'tex2DArrayvs(s, t)': 'texture(s,t)',
    },
    'hlsl5': {
        'ORYOL_GLSL': '(0)',
        'ORYOL_HLSL': '(1)',
        'ORYOL_METALSL': '(0)',
        '_vertexid': '_iVertexID',
        '_instanceid': '_iInstanceID',
        '_position': '_oPosition',
        '_pointsize': '_oPointSize',
        '_color': '_oColor',
        '_const': 'static const',
        '_func': '',
        'vec2': 'float2',
        'vec3': 'float3',
        'vec4': 'float4',
        'mat2': 'float2x2',
        'mat3': 'float3x3',
        'mat4': 'float4x4',
        'tex2D(_obj, _t)': '_obj.t.Sample(_obj.s,_t)',
        'texCUBE(_obj, _t)': '_obj.t.Sample(_obj.s,_t)',
        'tex2Dvs(_obj, _t)': '_obj.t.SampleLevel(_obj.s,_t,0.0)',
        'mix(a,b,c)': 'lerp(a,b,c)',
        'mod(x,y)': '(x-y*floor(x/y))',
        'fract(x)': 'frac(x)'
    },
    'metal': {
        'ORYOL_GLSL': '(0)',
        'ORYOL_HLSL': '(0)',
        'ORYOL_METALSL': '(1)',
        '_vertexid': 'vs_vertexid',
        '_instanceid': 'vs_instanceid',
        '_position': 'vs_out._vofi_position',
        '_pointsize': 'vs_out._vofi_pointsize',
        '_color': '_fo_color',
        '_color0': '_fo_color0',
        '_color1': '_fo_color1',
        '_color2': '_fo_color2',
        '_color3': '_fo_color3',
        '_const': 'constant',
        '_func': 'static',
        'bool': 'int',
        'vec2': 'float2',
        'vec3': 'float3',
        'vec4': 'float4',
        'mat2': 'float2x2',
        'mat3': 'float3x3',
        'mat4': 'float4x4',
        'mul(m,v)': '(m*v)',
        'mod(x,y)': '(x-y*floor(x/y))',
        'tex2D(_obj, _t)': '_obj.t.sample(_obj.s,_t)',
        'tex2DArray(_obj, _t)': '_obj.t.sample(_obj.s,_t)',
        'texCUBE(_obj, _t)': '_obj.t.sample(_obj.s,_t)',
        'tex3D(_obj, _t)': '_obj.t.sample(_obj.s,_t)',
        'tex2Dvs(_obj, _t)': '_obj.t.sample(_obj.s,_t,level(0))',
        'tex3Dvs(_obj, _t)': '_obj.t.sample(_obj.s,_t,level(0))',
        'tex2DArray(_obj, _t)': '_obj.t.sample(_obj.s,_t,level(0))',
        'discard': 'discard_fragment()'
    }
};

const validVsInNames = [
    'position', 'normal', 'texcoord0', 'texcoord1', 'texcoord2', 'texcoord3',
    'tangent', 'binormal', 'weights', 'indices', 'color0', 'color1',
    'instance0', 'instance1', 'instance2', 'instance3'
];
const validInOutTypes = [
    'float', 'vec2', 'vec3', 'vec4'
];

// NOTE: order is important, always go from greatest to smallest type,
// and keep texture samplers at start!
const validUniformTypes = [
    'mat4', 'mat3', 'mat2',
    'vec4', 'vec3', 'vec2',
    'float', 'int', 'bool'
];
const validUniformArrayTypes = [
    'mat4', 'vec4'
];

const uniformCType = {
    'bool':         'int',
    'int':          'int',
    'float':        'float',
    'vec2':         'glm::vec2',
    'vec3':         'glm::vec3',
    'vec4':         'glm::vec4',
    'mat2':         'glm::mat2',
    'mat3':         'glm::mat3',
    'mat4':         'glm::mat4',
};

const uniformOryolType = {
    'bool':         'UniformType::Bool',
    'int':          'UniformType::Int',
    'float':        'UniformType::Float',
    'vec2':         'UniformType::Vec2',
    'vec3':         'UniformType::Vec3',
    'vec4':         'UniformType::Vec4',
    'mat2':         'UniformType::Mat2',
    'mat3':         'UniformType::Mat3',
    'mat4':         'UniformType::Mat4',
};

const attrOryolType = {
    'float':    'VertexFormat::Float',
    'vec2':     'VertexFormat::Float2',
    'vec3':     'VertexFormat::Float3',
    'vec4':     'VertexFormat::Float4'
}

const attrOryolName = {
    'position':     'VertexAttr::Position',
    'normal':       'VertexAttr::Normal',
    'texcoord0':    'VertexAttr::TexCoord0',
    'texcoord1':    'VertexAttr::TexCoord1',
    'texcoord2':    'VertexAttr::TexCoord2',
    'texcoord3':    'VertexAttr::TexCoord3',
    'tangent':      'VertexAttr::Tangent',
    'binormal':     'VertexAttr::Binormal',
    'weights':      'VertexAttr::Weights',
    'indices':      'VertexAttr::Indices',
    'color0':       'VertexAttr::Color0',
    'color1':       'VertexAttr::Color1',
    'instance0':    'VertexAttr::Instance0',
    'instance1':    'VertexAttr::Instance1',
    'instance2':    'VertexAttr::Instance2',
    'instance3':    'VertexAttr::Instance3'
};

const validTextureTypes = ['sampler2D', 'samplerCube', 'sampler3D', 'sampler2DArray'];

const texOryolType = {
    'sampler2D':        'TextureType::Texture2D',
    'samplerCube':      'TextureType::TextureCube',
    'sampler3D':        'TextureType::Texture3D',
    'sampler2DArray':   'TextureType::TextureArray',
};

// Editor Error Helper

function fmtError(errorText) {
    throw new Error(errorText);
}
function setErrorLocation(fileName, line) {
    
}

// Helper
function checkListDup(name, objList) {
    for (const obj of objList) {
        if (name === obj.name) {
            return true;
        }
    }
    return false;
}

// code generation & parsing

function generate(input, outSrc, outHdr, args) {
    const shaderLibrary = new ShaderLibrary([input]);
    shaderLibrary.parseSources();
    shaderLibrary.resolveAllDependencies();
    shaderLibrary.validate();
    shaderLibrary.generateShaderSourcesGLSL();
    //shaderLibrary.generateShaderSourcesHLSL();
    //shaderLibrary.generateShaderSourcesMetal();
    shaderLibrary.validateShadersGLSL();
    generateSource(out_src, shaderLibrary);
    generateHeader(out_hdr, shaderLibrary);
}
class ShaderLibrary {
    constructor(inputs) {
        this.inputs = inputs;
    }
    /**
     * Parse one source file.
     */
    parseSources() {
        const parser = new Parser(this);
        this.sources.forEach(source => parser.parseSource());
    }
}
/**
 * Populate a shader library from annotated shader source files.
 */
class Parser {
    constructor(shaderLib) {
        this.shaderLib = shaderLib;
        this.fileName = void 0;
        this.lineNumber = 0;
        this.current = void 0;
        this.stack = [];
        this.inComment = false;
        this.regexPointSize = re.compile('[\s,;,=]*_pointsize[\s,;,=]*');
    }
    push(obj) {
        this.stack.push(obj);
        this.current = obj;
    }
    pop() {
        this.current = this.stack.pop();
    }
    parseSource(fileName, source) {
        this.fileName = fileName;
        this.lineNumber = 0;
        source.split().forEach((line, index) => {
            setErrorLocation(this.fileName, this.lineNumber);
            this.parseLine(line);
            this.lineNumber += 1;
        });
        // all blocks must be closed
        if (this.current !== void 0) {
            fmtError('missing @end at end of file');
        }
    }
    /**
     * Parse a single line.
     */
    parseLine(line) {
        line = this.stripComments(line);
        if (line !== '') {
            line = this.parseTags(line);
            this.parseSpecialKeyword(line);
            if (line !== '' && this.current !== void 0) {
                this.current.lines.append(Line(line, this.fileName, this.lineNumber))
            }
        }
    }
    /**
     *  Remove comments from a single line, can carry
     *  over to next or from previous line.
     */
    stripComments(line) {
        let done = false;
        while (!done) {
            if (this.inComment) {
                const endIndex = line.indexOf('*/');
                if (endIndex === -1) {
                    // entire line is comment
                    if (line.indexOf('/*') !== -1 || line.indexOf('//')) {
                        fmtError('Comment in comment!');
                    }
                    return '';
                }
                const comment = line.substring(0, endIndex + 2);
                if (comment.indexOf('/*') !== -1 || comment.indexOf('//')) {
                    fmtError('Comment in comment!');
                }
                line = line.substring(endIndex + 2);
                this.inComment = false;
            }
            const wingedIndex = line.indexOf('//');
            if (wingedIndex !== -1) {
                line = line.substring(0, wingedIndex);
            }
            const startIndex = line.indexOf('/*');
            if (startIndex !== -1) {
                endIndex = line.substring(startIndex).indexOf('*/', startIndex);
                if (endIndex !== -1) {
                    line = lines.substring(0, startIndex) + line.substring(endIndex + 2);
                } else {
                    // comment carries over to next line
                    this.inComment = true;
                    line = line.substring(0, startIndex);
                    done = true;
                }
            } else {
                // no comment until end of line, done
                done = true;
            }
        }
        return line.trim();
    }
    parseTags(line) {
         const tagStartIndex = line.indexOf('@');
         if (tagStartIndex !== -1) {
             if (tagStartIndex > 0) {
                 fmtError("only whitespace allowed in front of tag");
             }
             if (line.indexOf(';') !== -1) {
                 fmtError("no semicolons allowed in tag lines");
             }
             const tagAndArgs = line.substring(tagStartIndex + 1).split(' ');
             const tag = tagAndArgs[0];
             const args = tagAndArgs.slice(1);
             switch (tag) {
                 case 'code_block':
                 this.onCodeBlock(args);
                 break;
                 case 'vs':
                 this.onVertexShader(args);
                 break;
                 case 'fs':
                 this.onFragmentShader(args);
                 break;
                 case 'use_code_block':
                 this.onUseCodeBlock(args);
                 break;
                 case 'use_uniform_block':
                 this.onUseUniformBlock(args);
                 break;
                 case 'use_texture_block':
                 this.onUseTextureBlock(args);
                 break;
                 case 'in':
                 this.onIn(args);
                 break;
                 case 'out':
                 this.onOut(args);
                 break;
                 case 'uniform_block':
                 this.onUniformBlock(args);
                 break;
                 case 'texture_block':
                 this.onTextureBlock(args);
                 break;
                 case 'highp':
                 this.onPrecision(args);
                 break;
                 case 'program':
                 this.onProgram(args);
                 break;
                 case 'end':
                 this.onEnd(args);
                 break;
                 default:
                 fmtError("unrecognized @ tag '{}'".format(tag))
                 return '';

             }
         }
    }
    onCodeBlock(args) {
        if (args.length !== 1) {
            fmtError("@code_block must have 1 arg (name)");
        }
        if (this.current === void 0) {
            util.fmtError("@code_block must be at top level (missing @end in '{}'?)"); // .format(this.current.name)
        }
        const name = args[0];
        if (name in this.shaderLib.codeBlocks) {
            util.fmtError("@code_block '" + name + "' already defined");
        }
        const codeBlock = new CodeBlock(name);
        this.shaderLib.codeBlocks[name] = codeBlock;
    }
}
/**
 * A code block snippet.
 */
class CodeBlock {
    constructor(name) {
        this.name;
    }
    getTag() {
        return 'code_block';
    }
    dump() {
        Snippet.dump(this);
    }
}
/**
 * A shader uniform definition.
 */
class Uniform {
    constructor(type, num, name, bindName, filePath, lineNumber) {
        this.type = type;
        this.name = name;
        this.bindName = bindName;
        this.filePath = filePath;
        this.lineNumber = lineNumber;
        this.num = num;
    }
}
/**
 * A group of related shader uniforms.
 */
class UniformBlock {
    constructor(name, bindName, filePath, lineNumber) {
        this.name = name;
        this.bindName = bindName;
        this.bindStage = void 0;
        this.bindSlot = void 0;
        this.filePath = filePath;
        this.lineNumber = lineNumber;
        this.lines = [];
        this.uniforms = [];
        this.uniformsByType = {};
        // uniformsByType must be in the order of greatest to smallest
        // type, with samplers at the start
        for (type in validUniformTypes) {
            this.uniformsByType[type] = [];
        }
    }
    getTag() {
        return 'uniform_block';
    }
    parseUniformType(arg) {
        return arg.split('[')[0];
    }
    parseUniformArraySize(arg) {
        const tokens = arg.split('[');
        return tokens.length > 1 ? Number(token[1].strip[']']) : 1;
    }
    parseUniforms() {
        for (const line of this.lines) {
            setErrorLocation(line.path, line.lineNumber);
            const tokens = line.content.split();
            if (tokens.length !== 3) {
                fmtError("uniform must have 3 args (type name binding)");
            }
            const type = this.parseUniformType(tokens[0]);
            const num = this.parseUniformArraySize(tokens[0]);
            const name = tokens[1];
            const bind = tokens[2];
            if (!(type in validUniformTypes)) {
                fmtError("invalid uniform type '" + type + "', must be one of '" + validUniformTypes.join(', ') + "'!");
            }
        }
    }
}
/**
 * A texture shader parameter
 */
class Texture {
    constructor(type, name, bindName, filePath, lineNumber) {
        this.type = type;
        this.name = name;
        this.bindName = bindName;
        this.bindSlot = void 0;
        this.filePath = filePath;
        this.lineNumber = lineNumber;
    }
}
class TextureBlock {
    constructor(name, bindName, filePath, lineNumber) {
        this.name = name;
        this.bindName = bindName;
        this.bindStage = void 0;
        this.filePath = filePath;
        this.lineNumber = lineNumber;
        this.lines = [];
        this.textures = [];
    }
    getTag() {
        return 'texture_block';
    }
    parseTextures() {
        for (const line of this.lines) {
            setErrorLocation(line.path, line.lineNumber);
            const tokens = line.content.split();
            if (tokens.length !== 3) {
                fmtError("texture must have 3 args (type name binding)");
            }
            const type = tokens[0];
            const name = tokens[1];
            const bind = tokens[2];
            if (!(type in validTextureTypes)) {
                fmtError("invalid texture type '" + type + "', must be one of '" + validUniformTypes.join(', ') + "'!");
            }
            if (checkListDup(name, this.textures)) {
                fmtError("texture '" + name + "' already defined in '" + this.name + "'!");
            }
            this.textures.push(new Texture(type, name, bind, line.path, line.lineNumber));
        }
    }
}

class Attr {
    constructor() {
        this.type = type;
        this.name = name;
        this.capture = capture;
        this.filePath = filePath;
        this.lineNumber = lineNumber;
    }
    equal(other) {
        return (this.type === other.type) && (this.name === other.name);
    }
    notEqual(other) {
        return (this.type !== other.type) && (this.name !== other.name);
    }
}
class Shader {
    constructor(name) {
        this.name = name;
        this.highPrecision = [];
        this.uniformBlockRefs = [];
        this.uniformBlocks = []
        this.textureBlockRefs = [];
        this.textureBlocks = []
        this.inputs = []
        this.outputs = []
        this.resolvedDeps = []
        this.generatedSource = {}
        this.hasPointSize = False
        this.hasVertexId = False
        this.hasInstanceId = False
        this.hasColor1 = False
        this.hasColor2 = False
        this.hasColor3 = False
    }
}

/**
 * A vertex shader function.
 */
class VertexShader extends Shader {
    constructor(name) {
        super(name);
    }
    getTag() {
        return 'vs';
    }
}

/**
 * A fragment shader function.
 */
class FragmentShader extends Shader {
    constructor(name) {
        super(name);
    }
    getTag() {
        return 'fs';
    }
}

/**
 * A shader program, made of vertex/fragment shaders
 */
class Program {
    constructor(name, vs, fs, filePath, lineNumber) {
        this.name = name;
        this.vs = vs;
        this.fs = fs;
        this.uniformBlocks = [];
        this.textureBlocks = [];
        this.filePath = filePath;
        this.lineNumber = lineNumber;
    }
    getTag() {
        return 'program';
    }
}