export class TaskEntity {
  id: number; // Or string, like UUID, if you prefer
  title: string;
  // You might add other properties like 'completed: boolean', 'description: string', etc.

  constructor(id: number, title: string) {
    this.id = id;
    this.title = title;
  }
}