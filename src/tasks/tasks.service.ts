import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { NotFoundError } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { TaskRepository } from './taks.repository';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  getTasks(filterDto: GetTasksFilterDto) {}

  async getTaskByID(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id: id } });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();

    return task;
  }
  async deleteTaskByID(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    // else {
    //   throw new NotFoundException(`Task with ID "${id}" deleted successfully`);
    // }
    console.log(result);
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskByID(id);
    task.status = status;
    await task.save();
    return task;
  }
}
