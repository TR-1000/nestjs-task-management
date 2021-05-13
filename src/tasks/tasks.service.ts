import { Injectable, NotFoundException } from '@nestjs/common';
import {TaskStatus } from './task.model';
import * as uuid from "uuid/v1";
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TasksModule } from './tasks.module';


@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {}

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto);
    }


    async getAllTasks(): Promise<Task[]> {
        return this.taskRepository.getAllTasks();
    }


    async getTaskById(id: number): Promise<Task> {
       

        return this.taskRepository.getTaskById(id);
    }


    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto);
    }


    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        return this.taskRepository.updateTaskStatus(id, status) ;
    }


    async deleteTask(id: string) {

        return this.taskRepository.deleteTask(id);
    }





    // private tasks: Task[] = [];

    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }


    // getFilteredTasks(filterDto: GetTasksFilterDto): Task[] {
    //     const { status, search } = filterDto;
    //     let allTasks = this.getAllTasks();

    //     if(status) {
    //         allTasks = allTasks.filter(task => task.status === status);
    //     }

    //     if (search) {
    //         allTasks = allTasks.filter(task => task.title.includes(search) || task.description.includes(search)) 
    //     }


    //     return allTasks;
    // }


    // getTaskById(id: string): Task {
    //     const task = this.tasks.find(t => t.id === id);
        
    //     if(!task) {
    //         throw new NotFoundException('Task not found');
    //     }

    //     return{...task};
    // }

    

    // createTask(
    //     // title: string, description: string
    //     // swap out indivisual fields for a DTO
    //     createTaskDto: CreateTaskDto
    // ): Task {
    //     const {title, description } = createTaskDto;
    //     const task: Task = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN,
    //     }

    //     this.tasks.push(task);

    //     return task;
    // }

    
    // updateTaskStatus(id: string, status: TaskStatus): Task {
    //     const task = this.tasks.find(t => t.id === id);
        
    //     if(!task) {
    //         throw new NotFoundException('Task not found');
    //     }

    //     const index = this.tasks.indexOf(task);
    //     let updatedTask = {...task};

    //     if(status) {
    //         updatedTask.status = status;
    //     }

    //     this.tasks[index] = updatedTask;

    //     return this.tasks.find(t => t.id === id);
    // }


    // deleteTask(id: string): Task[] {
    //     const task = this.tasks.find(t => t.id === id);

    //     if (!task) {
    //         throw new NotFoundException('Task not found!');
    //     }

    //     const index = this.tasks.indexOf(task);
    //     this.tasks.splice(index,1)

    //     return this.tasks;
    // }

}
