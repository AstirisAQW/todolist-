import { TaskEntity } from '../../domain/entities/TaskEntity';
import type { TaskRepository } from '../../domain/repositories/TaskRepository';

let nextId = 1;
const tasks: TaskEntity[] = [];

export class InMemoryTaskRepository implements TaskRepository {
  async addTask(taskData: Omit<TaskEntity, 'id'>): Promise<TaskEntity> {
    const newTask = new TaskEntity(nextId++, taskData.title);
    // Add other properties if your entity has them
    tasks.push(newTask);
    return newTask;
  }

  async removeTask(id: number): Promise<void> {
    const index = tasks.findIndex(task => task.id === id);
    if (index > -1) {
      tasks.splice(index, 1);
    }
    // else throw new Error("Task not found"); // Optional error handling
  }

  async updateTask(updatedTask: TaskEntity): Promise<TaskEntity> {
    const index = tasks.findIndex(task => task.id === updatedTask.id);
    if (index > -1) {
      tasks[index] = updatedTask;
      return updatedTask;
    }
    throw new Error("Task not found for update");
  }

  async getAllTasks(): Promise<TaskEntity[]> {
    return [...tasks]; // Return a copy
  }

  async getTask(id: number): Promise<TaskEntity | null> {
    const task = tasks.find(task => task.id === id);
    return task || null;
  }
}