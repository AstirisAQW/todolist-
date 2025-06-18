import type { TaskEntity } from '../entities/TaskEntity';
import type { TaskRepository } from '../repositories/TaskRepository';

export class GetTaskUsecase {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(id: number): Promise<TaskEntity | null> {
    return this.taskRepository.getTask(id);
  }
}