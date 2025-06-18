export class TaskEntity {
  id: number;
  title: string;
  completed: boolean; // Added for more complete ToDo functionality

  constructor(id: number, title: string, completed: boolean = false) {
    this.id = id;
    this.title = title;
    this.completed = completed;
  }
}