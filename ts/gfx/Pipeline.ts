import { Program } from './Program';
import { PipelineState } from './PipelineState';
export class Pipeline {
    readonly name: string;
    readonly program: Program;
    readonly state: PipelineState;
    constructor(name, program: Program, state:PipelineState) {
        this.name = name;
        this.program = program;
        this.state = state;
    }
}