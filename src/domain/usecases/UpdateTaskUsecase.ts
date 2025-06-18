import type { TaskEntity } from '../entities/TaskEntity';
import type { TaskRepository } from '../repositories/TaskRepository';

export class UpdateTaskUsecase {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(taskData: TaskEntity): Promise<TaskEntity> {
    // Business logic for update, e.g., validation
    if (!taskData.title || taskData.title.trim() === "") {
        throw new Error("Task title cannot be empty for update.");
    }
    // Ensure task exists before update, or let repository handle it
    const existingTask = await this.taskRepository.getTask(taskData.id);
    if (!existingTask) {
        throw new Error(`Task with ID ${taskData.id} not found for update.`);
    }
    return this.taskRepository.updateTask(taskData);
  }
}