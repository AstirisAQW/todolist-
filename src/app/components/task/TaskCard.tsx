import React, { useState } from 'react';
import type { TaskEntity } from '../../../domain/entities/TaskEntity';

interface TaskCardProps {
  task: TaskEntity;
  onDelete: (id: number) => void;
  onToggleComplete: (task: TaskEntity) => void;
  onEdit: (task: TaskEntity) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onToggleComplete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editContent, setEditContent] = useState(task.content);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditTitle(task.title);
    setEditContent(task.content);
  };

  const handleSaveEdit = () => {
    // Allow saving if either title or content changed and at least one is non-empty,
    // or if the completion status is the only thing that would change (handled by onToggleComplete)
    // For simplicity, we save if any text field changed.
    if (editTitle.trim() !== task.title || editContent.trim() !== task.content) {
        // Only submit if there's actual text content overall
        if (editTitle.trim() || editContent.trim()) {
            onEdit({ ...task, title: editTitle.trim(), content: editContent.trim() });
        } else {
            // If both become empty, maybe delete or show a warning. For now, we allow it.
            // Or revert if that's desired.
            onEdit({ ...task, title: "", content: "" });
        }
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Optionally reset editTitle and editContent to task.title and task.content
    // setEditTitle(task.title);
    // setEditContent(task.content);
  };

  if (isEditing) {
    return (
      <div className="task-card editing">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Title"
          className="task-card-edit-title"
        />
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder="Take a note..."
          className="task-card-edit-content"
          rows={3}
          autoFocus
        />
        <div className="task-card-actions edit-mode">
          <button onClick={handleSaveEdit} className="action-button save">Save</button>
          <button onClick={handleCancelEdit} className="action-button cancel">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`} onClick={handleStartEdit}>
      <div className="task-card-header">
        <h3 className="task-card-title">{task.title || (task.content ? "" : "(Empty Note)")}</h3>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => {
            e.stopPropagation();
            onToggleComplete(task);
          }}
          className="task-card-checkbox"
          title={task.completed ? "Mark as pending" : "Mark as completed"}
        />
      </div>
      {task.content && (
        <p className="task-card-content" dangerouslySetInnerHTML={{ __html: task.content.replace(/\n/g, '<br />') }}></p>
      )}
      <div className="task-card-actions view-mode">
        <button
            onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
            }}
            className="action-button delete"
            title="Delete task"
        >
            🗑️
        </button>
      </div>
    </div>
  );
};

export default TaskCard;