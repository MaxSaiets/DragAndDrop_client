// src/store/task/taskSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ITask } from "../../types/task";
import { fetchTasksService, createTaskService, updateTaskService, deleteTaskService } from "../../services/task";

interface TaskState {
  tasks: ITask[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk<ITask[]>(
  "tasks/fetchTasks",
  async (_, thunkAPI) => {
    try {
      return await fetchTasksService();
    } catch {
      return thunkAPI.rejectWithValue("Failed to load tasks");
    }
  }
);

export const createTask = createAsyncThunk<ITask, Partial<ITask>>(
  "tasks/createTask",
  async (taskData, thunkAPI) => {
    try {
      return await createTaskService(taskData);
    } catch {
      return thunkAPI.rejectWithValue("Failed to create task");
    }
  }
);

export const updateTask = createAsyncThunk<ITask, { id: string; updates: Partial<ITask> }>(
  "tasks/updateTask",
  async ({ id, updates }, thunkAPI) => {
    try {
      return await updateTaskService(id, updates);
    } catch {
      return thunkAPI.rejectWithValue("Failed to update task");
    }
  }
);

export const deleteTask = createAsyncThunk<string, string>(
  "tasks/deleteTask",
  async (id, thunkAPI) => {
    try {
      await deleteTaskService(id);
      return id;
    } catch {
      return thunkAPI.rejectWithValue("Failed to delete task");
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTasks: (state) => {
      state.tasks = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<ITask[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<ITask>) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<ITask>) => {
        const idx = state.tasks.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) state.tasks[idx] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
      });
  },
});

export const { clearTasks } = taskSlice.actions;
export default taskSlice.reducer;