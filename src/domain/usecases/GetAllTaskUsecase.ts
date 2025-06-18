import type { TaskEntity } from '../entities/TaskEntity';
import type { TaskRepository } from '../repositories/TaskRepository';

export class GetAllTasksUsecase {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(): Promise<TaskEntity[]> {
    return this.taskRepository.getAllTasks();
  }
}