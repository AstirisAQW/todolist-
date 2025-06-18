import { TaskEntity } from '../../domain/entities/TaskEntity';
import type { TaskRepository, AddTaskData } from '../../domain/repositories/TaskRepository';

let nextId = 1;
const tasksStore: TaskEntity[] = [];

export class InMemoryTaskRepository implements TaskRepository {
  async addTask(taskData: AddTaskData): Promise<TaskEntity> {
    const newTask = new TaskEntity(nextId++, taskData.title, taskData.completed);
    tasksStore.push(newTask);
    return Promise.resolve(newTask);
  }

  async removeTask(id: number): Promise<void> {
    const index = tasksStore.findIndex(task => task.id === id);
    if (index > -1) {
      tasksStore.splice(index, 1);
    }
    else { throw new Error("Task not found to remove"); }
    return Promise.resolve();
  }

  async updateTask(updatedTask: TaskEntity): Promise<TaskEntity> {
    const index = tasksStore.findIndex(task => task.id === updatedTask.id);
    if (index > -1) {
      tasksStore[index] = updatedTask;
      return Promise.resolve(updatedTask);
    }
    throw new Error("Task not found for update");
  }

  async getAllTasks(): Promise<TaskEntity[]> {
    return Promise.resolve([...tasksStore]); // Return a copy
  }

  async getTask(id: number): Promise<TaskEntity | null> {
    const task = tasksStore.find(task => task.id === id);
    return Promise.resolve(task || null);
  }
}