import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';

import { TaskStatus } from './task-status.enums';
import { TasksService } from "./tasks.service";
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private readonly taskService: TasksService) {}

    @Get()
    getTask(
        @Req() req,
        @Query(ValidationPipe) filterDto: GetTasksFilterDto
    ) {
        return this.taskService.getTasks(filterDto, req.user);
    }

    @Get(':id')
    getTaskById(
        @Req() req,
        @Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.taskService.getTaskById(id, req.user);
    }


    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User, // custom anotation for getting user from jwt is not working so using 
        @Req() req,
    ): Promise<Task> {
        
        return this.taskService.createTask(createTaskDto, req.user);

    }

    @Patch(':id/status')
    updateTaskStatus(
        @Req() req,
        @Param('id', ParseIntPipe) id: number,
        // TaskStatusValidationPipe is optional
        @Body('status', TaskStatusValidationPipe) status: TaskStatus
    ): Promise<Task> {
        return this.taskService.updateTaskStatus(id, status, req.user);
    }

    @Delete(':id')
    async deleteTask(
        @Req() req,
        @Param('id', ParseIntPipe) id: number,
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
    ) {
        const result = await this.taskService.deleteTask(id, req.user);

        if (result) {
            await this.taskService.deleteTask(id, req.user);
            return this.getTask(req, filterDto);
        } else {
            throw new NotFoundException();
        }
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
