import { useState, useEffect } from 'react';
import { taskStore } from '@/lib/store';
import type { TaskList, Task, TaskStatus, TaskPriority } from '@/types';

export function useTaskStore() {
    const [taskLists, setTaskLists] = useState<TaskList[]>(taskStore.getTaskLists());

    useEffect(() => {
        const unsubscribe = taskStore.subscribe(() => {
            setTaskLists(taskStore.getTaskLists());
        });
        return unsubscribe;
    }, []);

    return {
        taskLists,
        getTaskList: (id: string) => taskStore.getTaskList(id),
        createTaskList: (data: Omit<TaskList, 'id' | 'createdDate' | 'updatedDate' | 'tasks'>) =>
            taskStore.createTaskList(data),
        updateTaskList: (id: string, data: Partial<Pick<TaskList, 'title' | 'description'>>) =>
            taskStore.updateTaskList(id, data),
        deleteTaskList: (id: string) => taskStore.deleteTaskList(id),
        createTask: (listId: string, data: Omit<Task, 'id' | 'createdDate' | 'updatedDate'>) =>
            taskStore.createTask(listId, data),
        updateTask: (listId: string, taskId: string, data: Partial<Omit<Task, 'id' | 'createdDate' | 'updatedDate'>>) =>
            taskStore.updateTask(listId, taskId, data),
        deleteTask: (listId: string, taskId: string) => taskStore.deleteTask(listId, taskId),
        getTaskListStats: (listId: string) => taskStore.getTaskListStats(listId),
    };
}