import React from 'react';
import type { TaskEntity } from '../../../domain/entities/TaskEntity';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: TaskEntity[];
  onDeleteTask: (id: number) => void;
  onToggleCompleteTask: (task: TaskEntity) => void;
  onEditTask: (task: TaskEntity) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDeleteTask, onToggleCompleteTask, onEditTask }) => {
  if (tasks.length === 0) {
    return <p className="no-tasks-message">No tasks found. Try a different filter or add a new task!</p>;
  }

  return (
    <div className="task-list-grid">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onDelete={onDeleteTask}
          onToggleComplete={onToggleCompleteTask}
          onEdit={onEditTask}
        />
      ))}
    </div>
  );
};

export default TaskList;