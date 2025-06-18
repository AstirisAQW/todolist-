export class Task {
    id: string;
    title: string;
    completed: boolean; 

    constructor(id: string, title: string, completed: boolean = false) {
        this.id = id;
        this.title = title;
        this.completed = completed;
    }
}