export interface ITask {
    id: string;
    title: string;
    description?: string;
    status: "todo" | "in_progress" | "done";
    priority: "low" | "medium" | "high";
    dueDate?: string;
    order: number;
    progress: number;
    userId: string;
    teamId?: string | null;
    createdAt: string;
    updatedAt: string;
}