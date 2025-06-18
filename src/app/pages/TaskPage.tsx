import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { fetchTasks, addNewTask, deleteTask, editTask, toggleTaskCompletion } from '../task/taskSlice';
import type { TaskEntity } from '../../domain/entities/TaskEntity';
import AddTaskForm from '../components/task/AddTaskForm';
import TaskList from '../components/task/TaskList';
import SearchBar from '../components/controls/Searchbar';
import FilterControls, { type FilterType } from '../components/controls/FilterControls';
import './TaskPages.css';

function TaskPage() {
  const dispatch: AppDispatch = useDispatch();
  const { tasks: allTasks, loading, error } = useSelector((state: RootState) => state.task);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');

  useEffect(() => {
    // Only fetch if idle, or if it previously failed and we want to retry on component mount
    if (loading === 'idle' || loading === 'failed') {
        dispatch(fetchTasks());
    }
  }, [dispatch, loading]); // Re-run if loading status changes to 'idle' or 'failed'

  const handleAddTask = (title: string, content: string) => {
    dispatch(addNewTask({ title, content, completed: false }));
  };

  const handleDeleteTask = (id: number) => {
    dispatch(deleteTask(id));
  };

  const handleToggleCompleteTask = (task: TaskEntity) => {
    dispatch(toggleTaskCompletion(task));
  };

  const handleEditTask = (task: TaskEntity) => {
    dispatch(editTask(task));
  };

  const filteredAndSearchedTasks = useMemo(() => {
    let tasksToProcess = allTasks;

    // Apply filter
    if (currentFilter === 'completed') {
      tasksToProcess = tasksToProcess.filter(task => task.completed);
    } else if (currentFilter === 'pending') {
      tasksToProcess = tasksToProcess.filter(task => !task.completed);
    }
    // 'all' requires no filtering here

    // Apply search
    if (searchTerm.trim() !== '') {
      const lowerSearchTerm = searchTerm.toLowerCase();
      tasksToProcess = tasksToProcess.filter(task =>
        task.title.toLowerCase().includes(lowerSearchTerm) ||
        task.content.toLowerCase().includes(lowerSearchTerm)
      );
    }
    return tasksToProcess;
  }, [allTasks, searchTerm, currentFilter]);

  let contentDisplay;
  // Show loading only on initial fetch when no tasks are present and no search/filter active
  const initialLoadCondition = loading === 'pending' && allTasks.length === 0 && searchTerm === '' && currentFilter === 'all';

  if (initialLoadCondition) {
    contentDisplay = <p className="loading-message">Loading tasks...</p>;
  } else if (error && loading !== 'pending') { // Show error if not actively loading something else
    contentDisplay = <p className="error-message">Error: {error}</p>;
  } else {
    contentDisplay = (
      <TaskList
        tasks={filteredAndSearchedTasks}
        onDeleteTask={handleDeleteTask}
        onToggleCompleteTask={handleToggleCompleteTask}
        onEditTask={handleEditTask}
      />
    );
    // If filteredAndSearchedTasks is empty after loading, TaskList will show its own "No tasks found" message.
  }

  return (
    <div className="task-page-container google-keep-layout">
      <header className="task-page-header keep-header">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      </header>

      <section className="add-task-section keep-add-task">
        <AddTaskForm onAddTask={handleAddTask} isLoading={loading === 'pending' && allTasks.length > 0 /* More specific loading for add form */} />
      </section>

      <nav className="filter-navigation keep-filters">
        <FilterControls currentFilter={currentFilter} onFilterChange={setCurrentFilter} />
      </nav>

      <main className="task-list-section keep-task-grid">
        {contentDisplay}
      </main>
    </div>
  );
}

export default TaskPage;