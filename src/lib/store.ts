import type { TaskList, Task, TaskStatus, TaskPriority } from '@/types';

// Mock data for development
const mockTaskLists: TaskList[] = [
    {
        id: '1',
        title: 'Work Projects',
        description: 'Tasks related to current work projects',
        createdDate: '2024-01-15T09:00:00Z',
        updatedDate: '2024-01-20T14:30:00Z',
        tasks: [
            {
                id: '1',
                title: 'Complete API documentation',
                description: 'Write comprehensive API documentation for the new endpoints',
                dueDate: '2024-02-01T23:59:59Z',
                status: 'OPEN',
                priority: 'HIGH',
                createdDate: '2024-01-15T09:00:00Z',
                updatedDate: '2024-01-15T09:00:00Z',
            },
            {
                id: '2',
                title: 'Review code changes',
                description: 'Review pull requests from team members',
                dueDate: '2024-01-25T17:00:00Z',
                status: 'CLOSED',
                priority: 'MEDIUM',
                createdDate: '2024-01-16T10:30:00Z',
                updatedDate: '2024-01-20T14:30:00Z',
            },
            {
                id: '3',
                title: 'Update dependencies',
                description: 'Update project dependencies to latest versions',
                dueDate: '2024-01-30T12:00:00Z',
                status: 'OPEN',
                priority: 'LOW',
                createdDate: '2024-01-17T11:15:00Z',
                updatedDate: '2024-01-17T11:15:00Z',
            },
        ],
    },
    {
        id: '2',
        title: 'Personal Development',
        description: 'Learning and skill improvement tasks',
        createdDate: '2024-01-10T08:00:00Z',
        updatedDate: '2024-01-18T16:45:00Z',
        tasks: [
            {
                id: '4',
                title: 'Complete React course',
                description: 'Finish the advanced React patterns course',
                dueDate: '2024-02-15T23:59:59Z',
                status: 'OPEN',
                priority: 'HIGH',
                createdDate: '2024-01-10T08:00:00Z',
                updatedDate: '2024-01-10T08:00:00Z',
            },
            {
                id: '5',
                title: 'Read TypeScript handbook',
                description: 'Study advanced TypeScript concepts',
                dueDate: '2024-02-10T23:59:59Z',
                status: 'CLOSED',
                priority: 'MEDIUM',
                createdDate: '2024-01-12T09:30:00Z',
                updatedDate: '2024-01-18T16:45:00Z',
            },
        ],
    },
    {
        id: '3',
        title: 'Home & Life',
        description: 'Personal and household tasks',
        createdDate: '2024-01-08T19:00:00Z',
        updatedDate: '2024-01-08T19:00:00Z',
        tasks: [],
    },
];

// Simple in-memory store for development
class TaskStore {
    private taskLists: TaskList[] = mockTaskLists;
    private listeners: Set<() => void> = new Set();

    subscribe(listener: () => void) {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    private notify() {
        this.listeners.forEach(listener => listener());
    }

    getTaskLists(): TaskList[] {
        return [...this.taskLists];
    }

    getTaskList(id: string): TaskList | undefined {
        return this.taskLists.find(list => list.id === id);
    }

    createTaskList(data: Omit<TaskList, 'id' | 'createdDate' | 'updatedDate' | 'tasks'>): TaskList {
        const now = new Date().toISOString();
        const newTaskList: TaskList = {
            ...data,
            id: Date.now().toString(),
            tasks: [],
            createdDate: now,
            updatedDate: now,
        };
        this.taskLists.push(newTaskList);
        this.notify();
        return newTaskList;
    }

    updateTaskList(id: string, data: Partial<Pick<TaskList, 'title' | 'description'>>): TaskList | null {
        const index = this.taskLists.findIndex(list => list.id === id);
        if (index === -1) return null;

        this.taskLists[index] = {
            ...this.taskLists[index],
            ...data,
            updatedDate: new Date().toISOString(),
        };
        this.notify();
        return this.taskLists[index];
    }

    deleteTaskList(id: string): boolean {
        const index = this.taskLists.findIndex(list => list.id === id);
        if (index === -1) return false;

        this.taskLists.splice(index, 1);
        this.notify();
        return true;
    }

    createTask(listId: string, data: Omit<Task, 'id' | 'createdDate' | 'updatedDate'>): Task | null {
        const listIndex = this.taskLists.findIndex(list => list.id === listId);
        if (listIndex === -1) return null;

        const now = new Date().toISOString();
        const newTask: Task = {
            ...data,
            id: Date.now().toString(),
            createdDate: now,
            updatedDate: now,
        };

        this.taskLists[listIndex].tasks.push(newTask);
        this.taskLists[listIndex].updatedDate = now;
        this.notify();
        return newTask;
    }

    updateTask(listId: string, taskId: string, data: Partial<Omit<Task, 'id' | 'createdDate' | 'updatedDate'>>): Task | null {
        const listIndex = this.taskLists.findIndex(list => list.id === listId);
        if (listIndex === -1) return null;

        const taskIndex = this.taskLists[listIndex].tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return null;

        const now = new Date().toISOString();
        this.taskLists[listIndex].tasks[taskIndex] = {
            ...this.taskLists[listIndex].tasks[taskIndex],
            ...data,
            updatedDate: now,
        };
        this.taskLists[listIndex].updatedDate = now;
        this.notify();
        return this.taskLists[listIndex].tasks[taskIndex];
    }

    deleteTask(listId: string, taskId: string): boolean {
        const listIndex = this.taskLists.findIndex(list => list.id === listId);
        if (listIndex === -1) return false;

        const taskIndex = this.taskLists[listIndex].tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return false;

        this.taskLists[listIndex].tasks.splice(taskIndex, 1);
        this.taskLists[listIndex].updatedDate = new Date().toISOString();
        this.notify();
        return true;
    }

    getTaskListStats(listId: string) {
        const list = this.getTaskList(listId);
        if (!list) return null;

        const total = list.tasks.length;
        const completed = list.tasks.filter(task => task.status === 'CLOSED').length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { total, completed, progress };
    }
}

export const taskStore = new TaskStore();

