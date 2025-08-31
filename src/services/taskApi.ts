import type { TaskList, Task, TaskStatus, TaskPriority } from '@/types';

const API_BASE_URL = "http://localhost:8585"; // Spring Boot backend

export class TaskApiService {

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {

        const url = `${API_BASE_URL}${endpoint}`;
        console.log(url)
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`FHIR API Error: ${response.status} ${response.statusText}`);
        }


        return response.json();

    }

    async getTaskList(): Promise<TaskList[]> {
        return this.request("/task-lists");
    }

}

// ---- Task List API ----
export const getTaskLists = async () => {
    const res = await fetch(`${API_BASE_URL}/task-lists`);
    if (!res.ok) throw new Error("Failed to fetch task lists");
    return res.json();
};


export const createTaskList = async (taskList: { title: string; description: string }) => {
    const res = await fetch(`${API_BASE_URL}/task-lists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskList),
    });
    if (!res.ok) throw new Error("Failed to create task list");
    return res.json();
};

export const updateTaskList = async (id: string, taskList: { title: string; description: string }) => {
    const res = await fetch(`${API_BASE_URL}/task-lists/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskList),
    });
    if (!res.ok) throw new Error("Failed to update task list");
    return res.json();
};

export const deleteTaskList = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/task-lists/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete task list");
};

// ---- Task API ----
export const getTasks = async (taskListId: string) => {
    const res = await fetch(`${API_BASE_URL}/task-lists/${taskListId}/tasks`);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
};

export const createTask = async (taskListId: string, task: { title: string; description: string; priority: string }) => {
    const res = await fetch(`${API_BASE_URL}/task-lists/${taskListId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error("Failed to create task");
    return res.json();
};

export const updateTask = async (taskListId: string, taskId: string, task: any) => {
    const res = await fetch(`${API_BASE_URL}/task-lists/${taskListId}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error("Failed to update task");
    return res.json();
};

export const deleteTask = async (taskListId: string, taskId: string) => {
    const res = await fetch(`${API_BASE_URL}/task-lists/${taskListId}/task/${taskId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete task");
};