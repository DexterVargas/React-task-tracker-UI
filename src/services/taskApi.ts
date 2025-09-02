import type { TaskList, Task } from '@/types';

const API_BASE_URL = "http://localhost:8585"; // Spring Boot backend

export class TaskApiService {

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {

        const url = `${API_BASE_URL}${endpoint}`;

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`TaskTracker API Error: ${response.status} ${response.statusText}`);
        }

        if (response.status === 204) {
            return null as unknown as T;
        }

        return response.json() as Promise<T>;

    }

    async getTaskList(): Promise<TaskList[]> {
        return this.request("/task-lists");
    }

    async viewTaskList(taskListId: string): Promise<TaskList> {
        return this.request(`/task-lists/${taskListId}`);
    }

    async createTaskList(reqBody: { title: string, description: string }): Promise<TaskList> {
        return this.request(`/task-lists`,
            {
                method: 'POST',
                body: JSON.stringify(reqBody)
            }
        );
    }

    async updateTaskList(taskListId: string, reqBody: { title: string, description: string }): Promise<TaskList> {
        return this.request(`/task-lists/${taskListId}`,
            {
                method: 'PUT',
                body: JSON.stringify(reqBody)
            }
        );
    }

    async deleteTaskList(taskListId: string): Promise<void> {
        return this.request(`/task-lists/${taskListId}`,
            {
                method: 'DELETE'
            }
        );
    }

    async createTask(taskListId: string, reqBody: { title: string, description: string, priority: string, status: string, dueDate: string }): Promise<Task> {
        return this.request(`/task-lists/${taskListId}/tasks`,
            {
                method: 'POST',
                body: JSON.stringify(reqBody)
            }
        );
    }

    async updateTask(taskListId: string, taskId: string, reqBody: Omit<Task, 'created' | 'updated'>): Promise<Task> {
        return this.request(`/task-lists/${taskListId}/tasks/${taskId}`,
            {
                method: 'PUT',
                body: JSON.stringify(reqBody)
            }
        );
    }

    async updateTaskStatus(taskListId: string, taskId: string, reqBody: Task): Promise<Task> {

        console.log(reqBody)
        console.log(taskId, reqBody.id)
        return this.request(`/task-lists/${taskListId}/tasks/${taskId}`,
            {
                method: 'PUT',
                body: JSON.stringify(reqBody)
            }
        );
    }

    async getTaskDetails(taskListId: string, taskId: string): Promise<Task> {
        return this.request(`/task-lists/${taskListId}/tasks/${taskId}`,
            {
                method: 'GET',
            }
        );
    }

    async deleteTask(taskListId: string, taskId: string,): Promise<void> {
        return this.request(`/task-lists/${taskListId}/tasks/${taskId}`,
            {
                method: 'DELETE'
            }
        );
    }

}