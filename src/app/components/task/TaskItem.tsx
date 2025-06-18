import React, { useState } from 'react';
import type { TaskEntity } from '../../../domain/entities/TaskEntity';

interface TaskItemProps {
  task: TaskEntity;
  onDelete: (id: number) => void;
  onToggleComplete: (task: TaskEntity) => void;
  onEdit: (task: TaskEntity) => void;
  isDeleting?: boolean;
  isToggling?: boolean;
  isEditing?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onToggleComplete, onEdit, isDeleting, isToggling }) => {
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleEdit = () => {
    setIsEditingLocal(true);
    setEditTitle(task.title);
  };

  const handleSave = () => {
    if (editTitle.trim() !== task.title && editTitle.trim() !== "") {
        onEdit({ ...task, title: editTitle.trim() });
    }
    setIsEditingLocal(false);
  };

  const handleCancel = () => {
    setIsEditingLocal(false);
    setEditTitle(task.title); // Reset edit title
  }


  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      {isEditingLocal ? (
        <div className="task-edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
          />
          <button onClick={handleSave} className="save-btn">Save</button>
          <button onClick={handleCancel} className="cancel-btn">Cancel</button>
        </div>
      ) : (
        <>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task)}
            disabled={isToggling}
            className="task-checkbox"
          />
          <span className="task-title" onDoubleClick={handleEdit}>{task.title}</span>
          <div className="task-actions">
            <button onClick={handleEdit} className="edit-btn" disabled={isDeleting || isToggling}>Edit</button>
            <button onClick={() => onDelete(task.id)} className="delete-btn" disabled={isDeleting || isToggling}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </>
      )}
    </li>
  );
};

export default TaskItem;