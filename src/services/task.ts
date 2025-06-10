import { $authHost } from "./index";

import type { ITask } from "../types";

export const fetchTasksService = async (): Promise<ITask[]> => {
    const { data } = await $authHost.get<ITask[]>('api/tasks', {
        params: {
            include: 'comments,subtasks,files,creator,assignees,team'
        }
    });
    return data;
}

export const createTaskService = async (taskData: Partial<ITask>): Promise<ITask> => {
    const { data } = await $authHost.post<ITask>('/api/tasks', taskData);
    return data;
}

export const updateTaskService = async (id: string, updates: Partial<ITask>): Promise<ITask> => {
    const { data } = await $authHost.put<ITask>(`/api/tasks/${id}`, updates);
    return data;
}

export const deleteTaskService = async (id: string): Promise<void> => {
    await $authHost.delete(`/api/tasks/${id}`);
}
