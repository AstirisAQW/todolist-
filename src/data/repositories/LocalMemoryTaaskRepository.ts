import { TaskEntity } from '../../domain/entities/TaskEntity';
import type { TaskRepository } from '../../domain/repositories/TaskRepository';

const LOCAL_STORAGE_KEY = 'tasks';

export class LocalStorageTaskRepository implements TaskRepository {
  private getTasksFromStorage(): TaskEntity[] {
    const tasksJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    return tasksJson ? JSON.parse(tasksJson).map((t: any) => new TaskEntity(t.id, t.title /*, other props */)) : [];
  }

  private saveTasksToStorage(tasks: TaskEntity[]): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }

  private getNextId(tasks: TaskEntity[]): number {
    return tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  }

  async addTask(taskData: Omit<TaskEntity, 'id'>): Promise<TaskEntity> {
    const tasks = this.getTasksFromStorage();
    const newId = this.getNextId(tasks);
    const newTask = new TaskEntity(newId, taskData.title);
    tasks.push(newTask);
    this.saveTasksToStorage(tasks);
    return newTask;
  }

  async removeTask(id: number): Promise<void> {
    let tasks = this.getTasksFromStorage();
    tasks = tasks.filter(task => task.id !== id);
    this.saveTasksToStorage(tasks);
  }

  async updateTask(updatedTaskData: TaskEntity): Promise<TaskEntity> {
    let tasks = this.getTasksFromStorage();
    const index = tasks.findIndex(task => task.id === updatedTaskData.id);
    if (index > -1) {
      tasks[index] = updatedTaskData;
      this.saveTasksToStorage(tasks);
      return updatedTaskData;
    }
    throw new Error("Task not found for update");
  }

  async getAllTasks(): Promise<TaskEntity[]> {
    return this.getTasksFromStorage();
  }

  async getTask(id: number): Promise<TaskEntity | null> {
    const tasks = this.getTasksFromStorage();
    const task = tasks.find(task => task.id === id);
    return task || null;
  }
}