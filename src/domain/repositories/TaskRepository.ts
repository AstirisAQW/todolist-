import { TaskEntity } from '../entities/TaskEntity';

export interface TaskRepository {
  addTask(task: Omit<TaskEntity, 'id'>): Promise<TaskEntity>; // Input might not have ID yet
  removeTask(id: number): Promise<void>;
  updateTask(task: TaskEntity): Promise<TaskEntity>;
  getAllTasks(): Promise<TaskEntity[]>;
  getTask(id: number): Promise<TaskEntity | null>;
}