import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { NotFoundError } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { createQueryBuilder, Repository } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  private logger = new Logger('TasksService');

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getTaskByID(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    try {
      await task.save();
    } catch (error) {
      this.logger.error(
        `Failed to create a task for user "${user.username}". Data: ${createTaskDto}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    delete task.user;

    return task;
  }
  async deleteTaskByID(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, userId: user.id });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    // else {
    //   throw new NotFoundException(`Task with ID "${id}" deleted successfully`);
    // }
    console.log(result);
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskByID(id, user);
    task.status = status;
    await task.save();
    return task;
  }
}
