import {
    createSlice,
    createAsyncThunk,
    type PayloadAction,
    type SerializedError
} from '@reduxjs/toolkit';
import { TaskEntity } from '../../domain/entities/TaskEntity';
import type { TaskRepository, AddTaskData } from '../../domain/repositories/TaskRepository';

// --- Repository and Usecase Instantiation ---
import { InMemoryTaskRepository } from '../../data/repositories/InMemoryTaskRepository';
import { LocalStorageTaskRepository } from '../../data/repositories/LocalStorageTaskRepository';

import { AddTaskUsecase } from '../../domain/usecases/AddTaskUsecase';
import { GetAllTasksUsecase } from '../../domain/usecases/GetAllTaskUsecase';
import { RemoveTaskUsecase } from '../../domain/usecases/RemoveTaskUsecase';
import { UpdateTaskUsecase } from '../../domain/usecases/UpdateTaskUsecase';

const USE_LOCAL_STORAGE = true;
const taskRepository: TaskRepository = USE_LOCAL_STORAGE
    ? new LocalStorageTaskRepository()
    : new InMemoryTaskRepository();

const addTaskUsecase = new AddTaskUsecase(taskRepository);
const getAllTasksUsecase = new GetAllTasksUsecase(taskRepository);
const removeTaskUsecase = new RemoveTaskUsecase(taskRepository);
const updateTaskUsecase = new UpdateTaskUsecase(taskRepository);

export interface TaskState {
  tasks: TaskEntity[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
  currentRequestId: string | undefined;
}

const initialState: TaskState = {
  tasks: [],
  loading: 'idle',
  error: null,
  currentRequestId: undefined,
};

export const fetchTasks = createAsyncThunk<
    TaskEntity[],
    void,
    { rejectValue: string }
>(
    'tasks/fetchTasks',
    async (_, { rejectWithValue }) => {
        try {
            return await getAllTasksUsecase.execute();
        } catch (err: any) {
            return rejectWithValue(err.message || 'Failed to fetch tasks');
        }
    }
);

export const addNewTask = createAsyncThunk<
    TaskEntity,
    AddTaskData, // This type now implicitly includes `content` due to Omit<TaskEntity, 'id'>
    { rejectValue: string }
>(
    'tasks/addNewTask',
    async (taskData, { rejectWithValue }) => {
        try {
            // taskData will be { title: string, content?: string, completed?: boolean }
            return await addTaskUsecase.execute(taskData);
        } catch (err: any) {
            return rejectWithValue(err.message || 'Failed to add task');
        }
    }
);

export const deleteTask = createAsyncThunk<
    number,
    number,
    { rejectValue: string }
>(
    'tasks/deleteTask',
    async (id, { rejectWithValue }) => {
        try {
            await removeTaskUsecase.execute(id);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.message || 'Failed to delete task');
        }
    }
);

export const editTask = createAsyncThunk<
    TaskEntity,
    TaskEntity,
    { rejectValue: string }
>(
    'tasks/editTask',
    async (task, { rejectWithValue }) => {
        try {
            return await updateTaskUsecase.execute(task);
        } catch (err: any) {
            return rejectWithValue(err.message || 'Failed to update task');
        }
    }
);

export const toggleTaskCompletion = createAsyncThunk<
    TaskEntity,
    TaskEntity,
    { rejectValue: string }
>(
    'tasks/toggleTaskCompletion',
    async (task, { rejectWithValue }) => {
        try {
            const updatedTaskData = new TaskEntity(task.id, task.title, task.content, !task.completed);
            return await updateTaskUsecase.execute(updatedTaskData);
        } catch (err: any) {
            return rejectWithValue(err.message || 'Failed to toggle task completion');
        }
    }
);


const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state, action) => {
        if (state.loading === 'idle' || state.loading === 'succeeded' || state.loading === 'failed') {
            state.loading = 'pending';
            state.currentRequestId = action.meta.requestId;
            state.error = null;
        }
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        if (state.loading === 'pending' && state.currentRequestId === action.meta.requestId) {
            state.loading = 'succeeded';
            state.tasks = action.payload;
            state.currentRequestId = undefined;
            state.error = null;
        }
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        if (state.loading === 'pending' && state.currentRequestId === action.meta.requestId) {
            state.loading = 'failed';
            if (action.payload) {
                state.error = action.payload;
            } else {
                state.error = action.error.message || 'Fetch failed';
            }
            state.currentRequestId = undefined;
        }
      })
      .addCase(addNewTask.pending, (state) => {
          state.error = null;
      })
      .addCase(addNewTask.fulfilled, (state, action: PayloadAction<TaskEntity>) => {
        state.tasks.push(action.payload);
      })
      .addCase(addNewTask.rejected, (state, action) => {
        if (action.payload) {
            state.error = action.payload as string;
        } else {
            state.error = action.error.message || 'Add task failed';
        }
      })
      .addCase(deleteTask.pending, (state) => {
          state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        if (action.payload) {
            state.error = action.payload as string;
        } else {
            state.error = action.error.message || 'Delete task failed';
        }
      })
      .addMatcher(
        (action): action is PayloadAction<TaskEntity> =>
            action.type === editTask.fulfilled.type || action.type === toggleTaskCompletion.fulfilled.type,
        (state, action: PayloadAction<TaskEntity>) => {
            const index = state.tasks.findIndex(task => task.id === action.payload.id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
            state.error = null;
        }
      )
      .addMatcher(
        (action): action is (PayloadAction<string, string, {arg: any; requestId: string; aborted: boolean; condition: boolean; rejectedWithValue: true}, SerializedError> | PayloadAction<undefined, string, {arg: any; requestId: string; aborted: boolean; condition: boolean; rejectedWithValue: false}, SerializedError>) =>
            action.type === editTask.rejected.type || action.type === toggleTaskCompletion.rejected.type,
        (state, action) => {
            if (action.payload) {
                state.error = action.payload;
            } else if (action.error && action.error.message) {
                state.error = action.error.message;
            } else {
                state.error = 'Update task operation failed';
            }
        }
      );
  },
});

export default tasksSlice.reducer;