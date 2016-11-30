import { Task } from './Task';
import { TaskType } from './TaskType';
import { ExecutionType } from './ExecutionType';

export class LoadWebImage extends Task {
    readonly img:HTMLImageElement;
    src:string;

    constructor() {
        super(TaskType.LoadTexture2D, ExecutionType.async);
        this.img = document.createElement('img');
        this.img.onload = ({ target }) => this.taskManager.taskDone(this);
        this.src = '';
    }

    execute(ctx, taskBefore, parentTask, otherTasks, addTask) {
        this.img.src = this.src;
    }
    clear() {
        super.clear();
        this.src = '';
        this.img.src = '';
    }
}