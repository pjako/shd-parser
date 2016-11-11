const optimize = require('./glslOptimizer.js').optimize;

const isGLSL = {
    'glsl100': true,
    'glsl120': true,
    'glsl150': true,
    'hlsl5': false,
    'metal': false
};

const slVersions = ['glsl100', 'glsl120', 'glsl330', 'glsles3', 'hlsl5', 'metal'];
const glslOptimizerTarget = {
    'glsl100': 2, 
    'glsl120': 3,  
    'glsl330': 3,
    'glsles3': 3
}
const slSlangTypes = {
    'glsl100': 'ShaderLang::GLSL100',
    'glsl120': 'ShaderLang::GLSL120',
    'glsl330': 'ShaderLang::GLSL330',
    'glsles3': 'ShaderLang::GLSLES3',
    'hlsl5':   'ShaderLang::HLSL5',
    'metal':   'ShaderLang::Metal'
};
const isHLSL = {
    'glsl100': false,
    'glsl120': false,
    'glsl330': false,
    'glsles3': false,
    'hlsl5': true,
    'metal': false
};
const isMetal = {
    'glsl100': false,
    'glsl120': false,
    'glsl330': false,
    'glsles3': false,
    'hlsl5': false,
    'metal': true
};

const glslVersionNumber = {
    'glsl100': 100,
    'glsl120': 120,
    'glsl330': 330,
    'glsles3': 300,
    'hlsl5': false,
    'metal': false
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

function findByName(name, list) {
    for (let i = 0; list.length > i; i++) {
        if (list[i].name === name) {
            return list[i];
        }
    }
    return void 0;
}

function values(obj) {
    return Object.keys(obj).map(key => obj[key]);
}

function resolveImports(str) {

}

// code generation & parsing

module.exports = function generate(inputs, importResolver) {
    importResolver = importResolver || resolveImports;
    const shaderLibrary = new ShaderLibrary(inputs, importResolver);
    shaderLibrary.parseSources();
    shaderLibrary.resolveAllDependencies();
    shaderLibrary.validate();
    shaderLibrary.generateShaderSourcesGLSL();
    //shaderLibrary.generateShaderSourcesHLSL();
    //shaderLibrary.generateShaderSourcesMetal();
    shaderLibrary.validateShadersGLSL();
    return {
        programs: shaderLibrary.programs,
        vertexShaders: shaderLibrary.vertexShaders,
        fragmentShaders: shaderLibrary.fragmentShaders
    };
    // generateSource(out_src, shaderLibrary);
    // generateHeader(out_hdr, shaderLibrary);
}
module.exports.generator = module.exports.Default = module.exports;
class ShaderLibrary {
    constructor(inputs, importResolver) {
        this.importResolver = importResolver;
        this.sources = inputs;
        this.codeBlocks = {};
        this.uniformBlocks = {};
        this.textureBlocks = {};
        this.vertexShaders = {};
        this.fragmentShaders = {};
        this.programs = {};
        this.current = void 0;
    }
    /**
     * Parse one source file.
     */
    parseSources() {
        const parser = new Parser(this);
        this.sources.forEach(source => parser.parseSource('testFile.shd', source));
    }
    /**
     * Resolve all dependencies for vertex- and fragment shaders.
     * This populates the resolvedDeps, uniformBlocks and textureBlocks arrays.
     */
    resolveAllDependencies() {
        values(this.vertexShaders).forEach(sh => sh.dependencies.forEach(dep => this.resolveDeps(sh, dep)));
        values(this.fragmentShaders).forEach(sh => sh.dependencies.forEach(dep => this.resolveDeps(sh, dep)));
        values(this.programs).forEach(program => {
            this.resolveUniformAndTextureBlocks(program);
            this.assignBindSlotIndices(program);
        });
    }
    /**
     * Recursively resolve dependencies for a shader.
     */
    resolveDeps(shd, dep) {
        if (!(dep.name in this.codeBlocks)) {
            setErrorLocation(dep.path, dep.lineNumber);
            fmtError("unknown code_block dependency '" + dep.name + "'");
        }
        shd.resolvedDeps.push(dep.name);
        for (const depdepKey in this.codeBlocks[dep.name].dependencies) {
            this.resolveDeps(shd, this.codeBlocks[dep.name].dependencies[depdepKey]);
        }
    }
    /**
     * Remove duplicates from the resolvedDeps from the front.
     * While we're at it, reverse the order so that the
     * lowest level dependency comes first.
     */
    removeDuplicateDeps(shd) {
        const deps = [];
        shd.resolvedDeps = shd.resolvedDeps.filter(dep => deps.indexOf(dep) === -1 ? false : !!deps.push(dep)).reverse();
    }
    /**
     * Gathers all uniform- and texture-blocks from all shaders in the program
     * and assigns the bindStage
     */
    resolveUniformAndTextureBlocks(program) {
        if (!this.vertexShaders[program.vs]) {
            setErrorLocation(program.filePath, program.lineNumber);
            fmtError("unknown vertex shader '{" + program.vs + "}'");
        }
        this.vertexShaders[program.vs].uniformBlockRefs.forEach(uniformBlockRef => {
            this.checkAddUniformBlock(uniformBlockRef, program.uniformBlocks);
        });
        this.vertexShaders[program.vs].textureBlockRefs.forEach(textureBlockRef => {
            this.checkAddTextureBlock(textureBlockRef, program.uniformBlocks);
        });

        if (!this.fragmentShaders[program.fs]) {
            setErrorLocation(program.filePath, program.lineNumber);
            fmtError("unknown vertex shader '{" + program.fs + "}'");
        }
        this.fragmentShaders[program.fs].uniformBlockRefs.forEach(uniformBlockRef => {
            this.checkAddUniformBlock(uniformBlockRef, program.uniformBlocks);
        });
        this.fragmentShaders[program.fs].textureBlockRefs.forEach(textureBlockRef => {
            this.checkAddTextureBlock(textureBlockRef, program.uniformBlocks);
        });
    }
    /**
     * Resolve a uniform block ref and add to list with sanity checks.
     */
    checkAddUniformBlock(uniformBlockRef, list) {
        if (uniformBlockRef.name in this.uniformBlocks) {
            if (!findByName(uniformBlockRef.name, list)) {
                uniformBlock = this.uniformBlocks[uniformBlockRef.name];
                list.push(uniformBlock);
            }
        } else {
            setErrorLocation(uniformBlockRef.filePath, uniformBlockRef.lineNumber);
            fmtError("uniform_block '" + uniformBlockRef.name + "' not found!");
        }
    }
    /**
     * Resolve a texture block ref and add to list with sanity checks
     */
    checkAddTextureBlock(textureBlockRef, list) {
        if (textureBlockRef.name in this.textureBlockRef) {
            if (!findByName(textureBlockRef.name, list)) {
                uniformBlock = this.textureBlockRef[textureBlockRef.name];
                list.push(uniformBlock);
            }
        } else {
            setErrorLocation(textureBlockRef.filePath, textureBlockRef.lineNumber);
            fmtError("texture_block '" + textureBlockRef.name + "' not found!");
        }
    }
    /**
     * Assigns bindSlotIndex to uniform-blocks and
     * to textures inside texture blocks. These
     * are counted separately for the different shader stages (each
     * shader stage has its own bind slots)
     */
    assignBindSlotIndices(program) {
        let vsUBSlot = 0;
        let fsUBSlot = 0;
        program.uniformBlocks.forEach(ub => {
            if (ub.bindStage === 'vs') {
                ub.bindSlot = vsUBSlot;
                vsUBSlot += 1;
            } else {
                ub.bindSlot = fsUBSlot;
                fsUBSlot += 1;
            }
        });
        let vsTexSlot = 0;
        let fsTexSlot = 0;
        program.textureBlocks.forEach(tb => {
            if (tb.bindStage === 'vs') {
                tb.bindSlot = vsUBSlot;
                vsTexSlot += 1;
            } else {
                tb.bindSlot = fsUBSlot;
                fsTexSlot += 1;
            }
        });
    }
    /**
     * Runs additional validation check after programs are resolved and before
     * shader code is generated:
     * 
     * - check whether vertex shader output signatures match fragment
     *   shader input signatures, this is a D3D11 requirement, signatures
     *   must match exactly, even if the fragment shader doesn't use all output
     *   from the vertex shader.
     */
    validate() {
        for (const key in this.programs) {
            const prog = this.programs[key];
            const vs = this.vertexShaders[prog.vs];
            const fs = this.fragmentShaders[prog.fs];
            let fatalError = false;
            if (vs.outputs.length !== fs.inputs.length) {
                if (fs.inputs.length > 0) {
                    setErrorLocation(fs.inputs[0].filePath, fs.inputs[0].lineNumber);
                    fmtError("number of fs inputs doesn't match number of vs outputs");
                    fatalError = true;
                }
                if (vs.outputs.length > 0) {
                    setErrorLocation(vs.inputs[0].filePath, vs.inputs[0].lineNumber);
                    fmtError("number of vs outputs doesn't match number of fs outputs");
                    fatalError = true;
                }
                if (fatalError) {
                    throw new Error('vs validation error');
                }
            } else {
                vs.outputs.forEach((outAttr, index) => {
                    if (outAttr.notEqual(fs.inputs[index])) {
                        setErrorLocation(fs.inputs[index].filePath, fs.inputs[index].lineNumber)
                        fmtError("fs input doesn't match vs output (names, types and order must match)");
                        setErrorLocation(outAttr.filePath, outAttr.lineNumber);
                        fmtError("vs output doesn't match fs input (names, types and order must match)");
                    }
                });
            }
        }
    }
    /**
     * This generates the vertex- and fragment-shader source
     * for all GLSL versions.
     */
    generateShaderSourcesGLSL() {
        const gen = new GLSLGenerator(this);
        slVersions.forEach(slVersion => {
            if (isGLSL[slVersion]) {
                values(this.vertexShaders).forEach(vs => gen.genVertexShaderSource(vs, slVersion));
                values(this.fragmentShaders).forEach(fs => gen.genFragmentShaderSource(fs, slVersion));
            }
        })
    }
    /**
     * Run the shader sources through the GLSL reference compiler
     */
    validateShadersGLSL() {
        slVersions.forEach(slVersion => {
            if (isGLSL[slVersion]) {
                this.optimizedVertexShaders = values(this.vertexShaders).map(vs => {
                    const result = optimize(vs.generatedSource[slVersion].map(l => l.content).join('\n'), glslOptimizerTarget[slVersion], 'vs');
                    if (result.type === 'error') {
                        console.log('ERROR');
                        console.log(vs.generatedSource[slVersion].map(l => l.content).join('\n'));
                        setErrorLocation(vs.filePath, vs.lineNumber);
                        fmtError(result.error);
                    }
                    vs.optimizedSource[slVersion] = result.source;
                });
                this.optimizedFragmentShaders = values(this.fragmentShaders).map(fs => {
                    const result = optimize(fs.generatedSource[slVersion].map(l => l.content).join('\n'), glslOptimizerTarget[slVersion], 'fs');
                    if (result.type === 'error') {
                        console.log(fs.generatedSource[slVersion].map(l => l.content).join('\n'));
                        setErrorLocation(fs.filePath, fs.lineNumber);
                        fmtError(result.error);
                    }
                    fs.optimizedSource[slVersion] = result.source;
                });
            }
        });
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
        this.regexPointSize = new RegExp("[\s,;,=]*_pointsize[\s,;,=]*");
    }
    push(obj) {
        this.stack.push(obj);
        this.current = obj;
    }
    pop() {
        this.stack.pop();
        this.current = this.stack[this.stack.length - 1];
    }
    parseSource(fileName, source) {
        this.fileName = fileName;
        this.lineNumber = 0;
        source.split('\n').forEach((line, index) => {
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
                this.current.lines.push(new Line(line, this.fileName, this.lineNumber))
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
                 case 'codeBlock':
                 this.onCodeBlock(args);
                 break;
                 case 'vs':
                 this.onVertexShader(args);
                 break;
                 case 'fs':
                 this.onFragmentShader(args);
                 break;
                 case 'useCodeBlock':
                 case 'useCodeBlock':
                 this.onUseCodeBlock(args);
                 break;
                 case 'useUniformBlock':
                 case 'use_uniform_block':
                 this.onUseUniformBlock(args);
                 break;
                 case 'use_texture_block':
                 case 'useTextureBlock':
                 this.onUseTextureBlock(args);
                 break;
                 case 'in':
                 this.onIn(args);
                 break;
                 case 'out':
                 this.onOut(args);
                 break;
                 case 'uniform_block':
                 case 'uniformBlock':
                 this.onUniformBlock(args);
                 break;
                 case 'texture_block':
                 case 'textureBlock':
                 this.onTextureBlock(args);
                 break;
                 case 'highp':
                 this.onPrecision(args);
                 break;
                 case 'program':
                 this.onProgram(args);
                 break;
                 case 'import':
                 this.onImport(args);
                 break;
                 case 'end':
                 this.onEnd(args);
                 break;
                 default:
                 fmtError(`unrecognized @ tag '${tag}'`);
                 return '';

             }
         }
         return line;
    }
    /**
     * Checks for special keywords in line, and set internal flags.
     */
    parseSpecialKeyword(line) {
        if (this.current && line.match(this.regexPointSize)) {
            this.current.hasPointSize = true;
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
    onVertexShader(args) {
        if (args.length !== 1) {
            fmtError('@vs must have 1 arg (name)');
        }
        if (this.current) {
            fmtError(`cannot nest @vs (missing @end in '${this.current.name}'?)`);
        }
        const name = args[0];
        if (name in this.shaderLib.vertexShaders) {
            fmtError(`@vs '${name}' already defined`);
        }
        const vs = new VertexShader(name);
        this.shaderLib.vertexShaders[name] = vs;
        this.push(vs);
    }
    onFragmentShader(args) {
        if (args.length !== 1) {
            fmtError('@fs must have 1 arg (name)');
        }
        if (this.current) {
            fmtError(`cannot nest @fs (missing @end in '${this.current.name}'?)`);
        }
        const name = args[0];
        if (name in this.shaderLib.fragmentShaders) {
            fmtError(`@fs '${name}' already defined`);
        }
        const fs = new FragmentShader(name);
        this.shaderLib.fragmentShaders[name] = fs;
        this.push(fs);
    }
    onProgram(args) {
        if (args.length !== 3) {
            fmtError("@program must have 3 args (name vs fs)");
        }
        if (this.current) {
            fmtError(`cannot nest @program (missing @end in '${this.current.name}'?)`);
        }
        const name = args[0];
        const vs = args[1];
        const fs = args[2];
        this.shaderLib.programs[name] = new Program(name, vs, fs, this.fileName, this.lineNumber);
    }
    onIn(args) {
        if (!this.current || ['vs', 'fs'].indexOf(this.current.getTag()) === -1) {
            fmtError("@in must come after @vs or @fs!");
        }
        if (args.length !== 2) {
            fmtError("@in must have 2 args (type name)");
        }
        const type = args[0];
        const name = args[1];
        if (validInOutTypes.indexOf(type) === -1) {
            fmtError(`invalid 'in' type '${type}', must be one of '${validInOutTypes.join(', ')}'!`);
        }
        if (this.current.getTag() === 'vs') {
            if (validVsInNames.indexOf(name) === -1) {
                fmtError(`invalid input attribute name '${name}', must be one of '${validVsInNames.join(', ')}'!`);
            }
        }
        if (checkListDup(name, this.current.inputs)) {
            fmtError(`@in '${name}' already defined in '${this.current.name}'!`);
        }
        this.current.inputs.push(new Attr(type, name, this.fileName, this.lineNumber));
    }
    onOut(args) {
        if (!this.current || ['vs', 'fs'].indexOf(this.current.getTag()) === -1) {
            fmtError("@out must come after @vs or @fs!");
        }
        if (args.length !== 2) {
            fmtError("@out must have 2 args (type name)");
        }
        const type = args[0];
        const name = args[1];
        if (validInOutTypes.indexOf(type) === -1) {
            fmtError(`invalid 'out' type '${type}', must be one of '${validInOutTypes.join(', ')}'!`);
        }
        if (checkListDup(name, this.current.outputs)) {
            fmtError(`@out '${name}' already defined in '${this.current.name}'!`);
        }
        this.current.outputs.push(new Attr(type, name, this.fileName, this.lineNumber));
    }
    onPrecision(args) {
        if (!this.current || ['vs', 'fs'].indexOf(this.current.getTag()) === -1) {
            fmtError("@highp must come after @vs or @fs!");
        }
        if (args.length !== 1) {
            fmtError("@out must have 1 arg (type)");
        }
        this.current.highPrecision.push(args[0]);
    }
    onUseCodeBlock(args) {
        if (!this.current || ['code_block', 'vs', 'fs'].indexOf(this.current.getTag()) === -1) {
            fmtError("@code_block must come after @code_block or @vs or @fs!");
        }
        if (args.length < 1) {
            fmtError("@use_code_block must have at least one arg");
        }
        args.forEach(arg => this.current.dependencies.push(new Reference(arg, this.fileName, this.lineNumber)));
    }
    onUseUniformBlock(args) {
        if (!this.current || ['vs', 'fs'].indexOf(this.current.getTag()) === -1) {
            fmtError("@use_uniform_block must come after @vs or @fs!");
        }
        if (args.length < 1) {
            fmtError("@use_uniform_block must have at least one arg!");
        }
        args.forEach(arg => {
            if (!this.shaderLib.uniformBlocks[arg]) {
                fmtError(`unknown uniform_block name '${arg}'`);
            }
            const uniformBlock = this.shaderLib.uniformBlocks[arg];

            if (uniformBlock.bindStage !== void 0) {
                if (uniformBlock.bindStage !== this.current.getTag()) {
                    util.fmtError(`uniform_block '${arg}' cannot be used both in @vs and @fs!`);
                }
            }
            uniformBlock.bindStage = this.current.getTag();
            this.current.uniformBlockRefs.push(new Reference(arg, this.fileName, this.lineNumber));
            this.current.uniformBlocks.push(uniformBlock);
        });
    }
    onUseTextureBlock(args) {
        if (!this.current || ['vs', 'fs'].indexOf(this.current.getTag()) === -1) {
            fmtError("@use_texture_block must come after @vs or @fs!");
        }
        if (args.length < 1) {
            fmtError("@use_texture_block must have at least one arg!");
        }
        args.forEach(name => {
            if (!this.shaderLib.textureBlocks[name]) {
                fmtError(`unknown texture_block name '${name}'.`);
            }
            const textureBlock = this.shaderLib.textureBlocks[name];
            if (textureBlock.bindStage !== void 0) {
                if (textureBlock.bindStage !== this.current.getTag()) {
                    fmtError(`texture_block '${name}' cannot be used both in @vs and @fs!`);
                }
            }
            textureBlock.bindStage = this.current.getTag();
            this.current.textureBlockRefs.push(Reference(name, this.fileName, this.lineNumber));
            this.current.textureBlocks.push(textureBlock);
        });
    }
    onImport(args) {
        fmtError("@import is not supported yet");
        if (args.length !== 1) {
            fmtError("@import only has one argument");
        }
    }
    onEnd(args) {
        if (!this.current || ['uniform_block', 'texture_block', 'code_block', 'vs', 'fs', 'program'].indexOf(this.current.getTag()) === -1) {
            fmtError("@end must come after @uniform_block, @texture_block, @code_block, @vs, @fs or @program!");
        }
        if (args.length !== 0) {
            fmtError("@end must not have arguments");
        }
        if (['code_block', 'vs', 'fs'].indexOf(this.current.getTag()) !== -1 && this.current.lines === 0) {
            fmtError("no source code lines in @code_block, @vs or @fs section");
        }
        if (this.current.getTag() === 'uniform_block') {
            this.current.parseUniforms();
        }
        if (this.current.getTag() === 'texture_block') {
            this.current.parseTextures();
        }
        this.pop();
    }
}

/**
 * A line object with mapping to a source file and line number.
 */
class Line {
    constructor(content, path, lineNumber) {
        this.content = content;
        this.path = path;
        this.lineNumber = lineNumber;
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
            // additional type restrictions for uniform array types (because of alignment rules)
            if (num > 1 && validUniformArrayTypes.indexOf(type) === -1) {
                fmtError(`invalid uniform array type '${type}', must be '${validUniformArrayTypes.join('\n')}'!`);
            }
            if (checkListDup(name, this.uniforms)) {
                fmtError(`uniform '${name}' already defined in '${this.name}'!`);
            }
            const uniform = new Uniform(type, num, name, bind, line.path, line.lineNumber);
            this.uniforms.push(uniform);
            this.uniformsByType[type].push(uniform);
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
    constructor(type, name, filePath, lineNumber) {
        this.type = type;
        this.name = name;
        this.filePath = filePath;
        this.lineNumber = lineNumber;
    }
    equal(other) {
        return (this.type === other.type) && (this.name === other.name);
    }
    notEqual(other) {
        return !this.equal(other);
    }
}
class Shader {
    constructor(name) {
        this.name = name;
        this.lines = [];
        this.options = {};
        this.dependencies = [];
        this.highPrecision = [];
        this.uniformBlockRefs = [];
        this.uniformBlocks = [];
        this.textureBlockRefs = [];
        this.textureBlocks = [];
        this.inputs = [];
        this.outputs = [];
        this.resolvedDeps = [];
        this.generatedSource = {};
        this.optimizedSource = {};
        this.hasPointSize = false;
        this.hasVertexId = false;
        this.hasInstanceId = false;
        this.hasColor1 = false;
        this.hasColor2 = false;
        this.hasColor3 = false;
    }
}

/**
 * A vertex shader function.
 */
class VertexShader extends Shader {
    constructor(name) {
        super(name);
        this.inputLayout = [];
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
        this.options = {};
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
/**
 * A pipline state
 */
class State {
    constructor(name) {
        this.name = name;
        this.options = {};
    }
    getTag() {
        return 'state';
    }
}
/**
 * A render pass
 */
class Pass {
    constructor(name) {
        this.name = name;
        this.options = {};
    }
    getTag() {
        return 'pass';
    }
}
/**
 * Generate vertex and fragment shader source code for GLSL dialects
 */
class GLSLGenerator {
    constructor(shaderLib) {
        this.shaderLib = shaderLib;
    }
    genVertexShaderSource(vs, slVersion) {
        let lines = [];

        // version tag
        if (glslVersionNumber[slVersion] > 100) {
            lines.push(new Line('#version ' + glslVersionNumber[slVersion]));
        }

        // extensions
        if (glslVersionNumber[slVersion] >= 450) {
            lines.push(new Line('#extension GL_ARB_separate_shader_objects : enable'));
            lines.push(new Line('#extension GL_ARB_shading_language_420pack : enable'));
        }

        // write compatibility macros
        Object.keys(slMacros[slVersion]).forEach(macro => lines.push(new Line('#define ' + macro + ' ' + slMacros[slVersion][macro])));

        // precision modifiers
        // (NOTE: GLSL spec says that GL_FRAGMENT_PRECISION_HIGH is also avl. in vertex language)

        if (slVersion == 'glsl100') {
            if (vs.highPrecision) {
                lines.push(new Line('#ifdef GL_FRAGMENT_PRECISION_HIGH'));
                vs.highPrecision.forEach(type => lines.push(new Line('precision highp ' + type + ';')));
            }
            lines.push(new Line('#endif'));
        }

        lines = this.genUniforms(vs, slVersion, lines);

        // write vertex shader inputs
        vs.inputs.forEach(input => lines.push(new Line(`${glslVersionNumber[slVersion] < 130 ? 'attribute' : 'in'} ${input.type} ${input.name};`,
            input.filePath, input.lineNumber)));

        // write vertex shader outputs
        vs.outputs.forEach(output => lines.push(new Line(`${glslVersionNumber[slVersion] < 130 ? 'varying' : 'out'} ${output.type} ${output.name};`,
            output.filePath, output.lineNumber)));

        // write blocks the vs depends on
        vs.resolvedDeps.forEach(dep => this.genLines(lines, this.shaderLib.codeBlocks[dep].lines));

        // write vertex shader function
        lines.push(new Line('void main() {', vs.lines[0].path, vs.lines[0].lineNumber));
        lines = this.genLines(lines, vs.lines.filter(l => l.content[0] !== '@'));
        lines.push(new Line('}', vs.lines[vs.lines.length - 1].path, vs.lines[vs.lines.length - 1].lineNumber));
        vs.generatedSource[slVersion] = lines;
    }
    genUniforms(shd, slVersion, lines) {
        if (glslVersionNumber[slVersion] < 300) {
            // no GLSL uniform blocks
            shd.uniformBlocks.forEach(ub => values(ub.uniformsByType).forEach(uniform => {
                if (uniform.num === 1) {
                    lines.push(new Line(`uniform ${uniform.type} ${uniform.name};`,
                        uniform.filePath, uniform.lineNumber));
                } else {
                    lines.push(new Line(`uniform ${uniform.type} ${uniform.name}[${uniform.num}];`,
                        uniform.filePath, uniform.lineNumber));
                }
            }));
            shd.textureBlocks.forEach(tb => tb.textures.forEach(tex => lines.push(new Line(`uniform ${tex.type} ${tex.name};`, tex.filePath, tex.lineNumber))));
        } else {
            // GLSL uniform blocks
            shd.uniformBlocks.forEach(ub => {
                lines.push(new Line(`layout (std140) uniform ${ub.name} {{`, ub.filePath, ub.lineNumber));
                Object.keys(uBlock.uniformsByType).forEach(type => uBlock.uniformsByType[type].forEach(uniform => {
                    if (uniform.num === 1) {
                        lines.push(Line(`  ${uniform.type} ${uniform.name};`,
                            uniform.filePath, uniform.lineNumber));
                    } else {
                        lines.push(Line(`  ${uniform.type} ${uniform.name}[${uniform.num}];`,
                            uniform.filePath, uniform.lineNumber));
                    }
                }));
                lines.push(new Line('};', ub.filePath, ub.lineNumber));
            });
            shd.textureBlocks.forEach(tb => tb.textures.forEach(tex => lines.push(new Line(`uniform ${tex.type} ${tex.name};`, tex.filePath, tex.lineNumber))));
        }

        return lines;
    }
    genLines(dstLines, srcLines) {
        return dstLines.concat(srcLines);
    }
    genFragmentShaderSource(fs, slVersion) {
        let lines = [];

        // version tag
        lines.push(new Line(`#version ${slVersion == 'glsles3' ? '300 es' : glslVersionNumber[slVersion]}`));

        // write compatibility macros
        Object.keys(slMacros[slVersion]).forEach(macro => lines.push(new Line('#define ' + macro + ' ' + slMacros[slVersion][macro])));

        // precision modifiers
        if (slVersion === 'glsl100' || slVersion === 'glsles3') {
            lines.push(new Line('precision mediump float;'));
            if (fs.highPrecision) {
                if ('glsl100' === slVersion) {
                    lines.push(new Line('#ifdef GL_FRAGMENT_PRECISION_HIGH'));
                }
                fs.highPrecision.forEach(type => lines.push(new Line(`precision highp ${type};`)));
                if ('glsl100' === slVersion) {
                    lines.push(new Line('#endif'));
                }
            }
        }

        // write uniform definition
        lines = this.genUniforms(fs, slVersion, lines);

        // write fragment shader inputs
        fs.inputs.forEach(input => lines.push(new Line(`${glslVersionNumber[slVersion] < 130 ? 'varying' : 'in'} ${input.type} ${input.name};`,
            input.filePath, input.lineNumber)));

        // write the fragcolor output
        if (glslVersionNumber[slVersion] >= 130) {
            if (glslVersionNumber[slVersion] >= 300) {
                lines.push(new Line('layout (location = 0) out vec4 _FragColor;'));
                if (fs.hasColor1) {
                    lines.push(new Line('layout (location = 1) out vec4 _FragColor1;'));
                }
                if (fs.hasColor2) {
                    lines.push(new Line('layout (location = 2) out vec4 _FragColor2;'));
                }
                if (fs.hasColor3) {
                    lines.push(new Line('layout (location = 3) out vec4 _FragColor3;'));
                }
            } else {
                lines.push(new Line('out vec4 _FragColor;'));
            }
        }

        // write blocks the fs depends on
        fs.resolvedDeps.forEach(dep => lines = this.genLines(lines, this.shaderLib.codeBlocks[dep].lines));

        // write fragment shader function
        lines.push(new Line('void main() {', fs.lines[0].path, fs.lines[0].lineNumber));
        lines = this.genLines(lines, fs.lines.filter(l => l.content[0] !== '@'));
        lines.push(new Line('}', fs.lines[fs.lines.length - 1].path, fs.lines[fs.lines.length - 1].lineNumber));
        fs.generatedSource[slVersion] = lines;
    }
}