import { TaskType } from './TaskType';
import { ExecutionType } from './ExecutionType';
export abstract class Task {
    readonly taskType: TaskType;
    readonly executionType: ExecutionType;
    parentTaskId: number;
    nextTask: number;
    id: number;
    constructor(taskType: TaskType, executionType: ExecutionType) {
        this.taskType = taskType;
        this.executionType = executionType;
        this.clear();
    }
    execute(ctx, taskBefore, parentTask, otherTasks, addTask): void {

    }
    clear() {
        this.parentTaskId = -1;
        this.nextTask = -1;
        this.id = -1;
    }
}

