import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';

import { TaskStatus } from './task.model';
import { TasksService } from "./tasks.service";

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private readonly taskService: TasksService) {}

    @Get()
    getTask(@Query(ValidationPipe) filterDto: GetTasksFilterDto) {
        return this.taskService.getTasks(filterDto);
    }

    @Get(':id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.taskService.getTaskById(id);
    }


    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto
    ): Promise<Task> {
        return this.taskService.createTask(createTaskDto);

    }

    @Patch(':id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        // TaskStatusValidationPipe is optional
        @Body('status', TaskStatusValidationPipe) status: TaskStatus
    ): Promise<Task> {
        return this.taskService.updateTaskStatus(id, status);
    }

    @Delete(':id')
    deleteTask(@Param('id', ParseIntPipe) id: string): Promise<Task[]> {
        return this.taskService.deleteTask(id);
        
    }

    // @Get()
    // getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {

    //     if (Object.keys(filterDto).length) {
    //         return this.taskService.getFilteredTasks(filterDto);
    //     } else {
    //         return this.taskService.getAllTasks();
    //     }
       
    // }

    // @Get(':id')
    // getTaskById(@Param('id') id: string): Task {
    //     return this.taskService.getTaskById(id);
    // }

    // @Post()
    // @UsePipes(ValidationPipe)
    // createTask(
    //     @Body() createTaskDto: CreateTaskDto
    //     // swap out indivisual fields for a DTO
    //     // @Body('title') title: string,
    //     // @Body('description') desc: string, 
    // ): Task {
    //     return this.taskService.createTask(createTaskDto);

    // }

    // @Delete(':id')
    // deleteTask(@Param('id') id: string): Task[] {
    //     return this.taskService.deleteTask(id);
    // }

    // @Patch(':id/status')
    // updateTaskStatus(
    //     @Param('id') id: string,
    //     // TaskStatusValidationPipe is optional
    //     @Body('status', TaskStatusValidationPipe) status: TaskStatus
    // ): Task {
    //     return this.taskService.updateTaskStatus(id, status);
    // }

}
