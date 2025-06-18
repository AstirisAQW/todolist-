import type { TaskEntity } from '../entities/TaskEntity';
import type { TaskRepository, AddTaskData } from '../repositories/TaskRepository';

export class AddTaskUsecase {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(taskData: AddTaskData): Promise<TaskEntity> {
    if (!taskData.title && !taskData.content) { // Allow task if at least title or content exists
        throw new Error("Task must have a title or content.");
    }
    const dataToSave: AddTaskData = {
        title: taskData.title || "", // Ensure title is string
        content: taskData.content || "", // Ensure content is string
        completed: taskData.completed !== undefined ? taskData.completed : false,
    };
    return this.taskRepository.addTask(dataToSave);
  }
}