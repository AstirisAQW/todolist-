import React, { useState, useRef, useEffect } from 'react';

interface AddTaskFormProps {
  onAddTask: (title: string, content: string) => void;
  isLoading?: boolean;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask, isLoading }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmitAndReset = () => {
    if (title.trim() || content.trim()) {
      onAddTask(title.trim(), content.trim());
      setTitle('');
      setContent('');
      setIsExpanded(false);
    } else {
        setIsExpanded(false); // Collapse if empty and clicked away or submitted
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmitAndReset();
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(event.target as Node)) {
      if (isExpanded) { // Only submit and reset if it was expanded (i.e., user interacted)
        handleSubmitAndReset();
      }
    }
  };

  useEffect(() => {
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, title, content]); // Re-add listener if isExpanded or content changes


  const handleFocus = () => {
    setIsExpanded(true);
  };

  return (
    <form onSubmit={handleFormSubmit} className={`add-task-form ${isExpanded ? 'expanded' : ''}`} ref={formRef}>
      {isExpanded && (
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="add-task-title-input"
        />
      )}
      <textarea
        placeholder="Take a note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onFocus={handleFocus}
        className="add-task-content-input"
        rows={isExpanded ? 3 : 1}
        disabled={isLoading}
      />
      {isExpanded && (
        <div className="add-task-actions">
          {/* Submit button is implicit via form onSubmit */}
          <button type="button" onClick={handleSubmitAndReset} className="add-task-close-button" disabled={isLoading}>
            Close
          </button>
        </div>
      )}
    </form>
  );
};

export default AddTaskForm;