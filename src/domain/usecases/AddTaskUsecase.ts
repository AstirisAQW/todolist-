import type { TaskEntity } from '../entities/TaskEntity';
import type { TaskRepository, AddTaskData } from '../repositories/TaskRepository';

export class AddTaskUsecase {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(taskData: AddTaskData): Promise<TaskEntity> {
    if (!taskData.title || taskData.title.trim() === "") {
        throw new Error("Task title cannot be empty.");
    }
    // Other business logic, e.g., default completion status
    const dataToSave: AddTaskData = {
        title: taskData.title,
        completed: taskData.completed !== undefined ? taskData.completed : false,
    };
    return this.taskRepository.addTask(dataToSave);
  }
}