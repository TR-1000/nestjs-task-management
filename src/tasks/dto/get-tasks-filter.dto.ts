import { IsNotEmpty, IsIn, IsOptional } from "class-validator";
import { TaskStatus } from "../task-status.enums";



export class GetTasksFilterDto {
    @IsOptional()
    @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    status: TaskStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}