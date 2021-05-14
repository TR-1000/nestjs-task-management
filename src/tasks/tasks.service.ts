import { Injectable, NotFoundException } from '@nestjs/common';
import {TaskStatus } from './task-status.enums';
import * as uuid from "uuid/v1";
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TasksModule } from './tasks.module';
import { User } from 'src/auth/user.entity';


@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {}

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }


    async getAllTasks(): Promise<Task[]> {
        return this.taskRepository.getAllTasks();
    }


    async getTaskById(id: number, user: User): Promise<Task> {
        const foundTask = await this.taskRepository.findOne( 
            { where: {id, userId: user.id} } 
        )

        if(!foundTask) {
            throw new NotFoundException();
        }

        return foundTask;
    }


    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }


    async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {

        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        return task;
    }


    async deleteTask(id: number, user: User) {
        let result = false;
        const deleteResult =  await this.taskRepository.delete({ id, userId: user.id });

        if (deleteResult.affected === 0) {
            result = false;
        } else {
            result = true;
        }
  
        return result;
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
