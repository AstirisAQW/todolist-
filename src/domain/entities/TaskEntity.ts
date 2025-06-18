export class TaskEntity {
  id: number;
  title: string;
  content: string; // New field for task description/content
  completed: boolean;

  constructor(id: number, title: string, content: string = "", completed: boolean = false) {
    this.id = id;
    this.title = title;
    this.content = content; // Initialize content
    this.completed = completed;
  }
}