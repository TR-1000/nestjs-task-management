import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task.model";



export class TaskStatusValidationPipe implements PipeTransform {

    readonly allowedStatus = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE

    ];

    private isStatusValid(status: any) {
        const index = this.allowedStatus.indexOf(status);
        return index !== -1;
    }

    transform(value: any, metadata: ArgumentMetadata) {
        value=value.toUpperCase();
        console.log('value', value);
        console.log('metadata', metadata);
        
        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`'${value}' is an invalid status`)
        }

        return value;
        
    }
}