import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}
  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto) {
    return this.tasksService.getTasks(filterDto);
  }

  @Get('/:id')
  getTaskByID(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskByID(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTaskByID(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tasksService.deleteTaskByID(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskValidationPipe) status: TaskStatus,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status);
  }
}
