import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { findIndex } from 'rxjs';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTaskById(id: string): Task {
        return this.tasks.find((task) => task.id === id);
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto; 
        
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        };

        this.tasks.push(task);
        return task;
    }

    deleteTask(id: string): void {
        // best practice 
        // this.tasks = this.tasks.filter((task) => task.id !== id);

        const deleteTask = this.tasks.findIndex((task) => task.id === id);
        this.tasks.splice(deleteTask);
    }

    updateTaskStatus(id: string, status: TaskStatus): Task {
        const updateTaskIndex = this.tasks.findIndex((task) => task.id === id);
        this.tasks[updateTaskIndex].status = status;
        return this.tasks[updateTaskIndex];
    }
}
