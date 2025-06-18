import type { TaskRepository } from '../repositories/TaskRepository';

export class RemoveTaskUsecase {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(id: number): Promise<void> {
    return this.taskRepository.removeTask(id);
  }
}