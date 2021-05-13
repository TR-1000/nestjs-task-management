import { EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from './dto/create-task.dto';
import {TaskStatus } from './task.model';
import { NotFoundException } from "@nestjs/common";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";


@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    getAllTasks(): Promise<Task[]> {
        return this.find();
    }

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');

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



    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const {title, description } = createTaskDto;

        const task =  new Task(); 
            task.description = description;
            task.title = title;
            task.status = TaskStatus.OPEN;
            
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