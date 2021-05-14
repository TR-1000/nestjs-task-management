import { EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from './dto/create-task.dto';
import {TaskStatus } from './task-status.enums';
import { NotFoundException } from "@nestjs/common";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { User } from "src/auth/user.entity";


@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async getAllTasks(): Promise<Task[]> {
        return this.find();
    }

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
        query.where('task.userId = :userId', { userId: user.id})

        if (status) {
            query.andWhere('task.status = :status', { status })
        }

        if (search) {
            query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` });
        }

        const tasks = await query.getMany();

        return tasks;
    }


    async getTaskById(id: number): Promise<Task> {
        const task = await this.findOne(id);
        
        if(!task) {
            throw new NotFoundException('Task not found');
        }

        return task;
    }



    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const {title, description } = createTaskDto;

        const task =  new Task(); 
            task.description = description;
            task.title = title;
            task.status = TaskStatus.OPEN;
            task.user = user;
            
        await task.save();

        return task;
    }


    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task = this.getTaskById(id);
        (await task).status = status;
        (await task).save();

        return await task;
    }


    async deleteTask(id: string): Promise<Task[]> {
        
        await this.delete(id)

        return this.getAllTasks();
    
    }
}