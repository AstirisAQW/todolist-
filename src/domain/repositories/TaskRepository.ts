import { Task } from '../entities/Task';

export interface ITaskRepository {
    addTask(taskData: Omit<Task, 'id' | 'completed'>): Promise<Task>;
    removeTask(id: string): Promise<void>;
    updateTask(id: string, updates: Partial<Omit<Task, 'id'>>): Promise<Task | null>;
    getAllTasks(): Promise<Task[]>;
    getTask(id: string): Promise<Task | null>;
    toggleTaskCompletion(id: string): Promise<Task | null>;
}