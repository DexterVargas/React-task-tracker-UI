import { useState, useEffect } from 'react';
import type { Task, TaskStatus, TaskPriority, TaskList } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { toast } from "sonner";

interface TaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    listId: string | null;
    task?: Task | null;
    onClose: () => void;
    taskListData: TaskList | null;
}
import { TaskApiService } from '@/services/taskApi';

const api = new TaskApiService();

export function TaskDialog({ open, onOpenChange, listId, task, onClose, taskListData }: TaskDialogProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
    const [status, setStatus] = useState<TaskStatus>('OPEN');
    const [dueDate, setDueDate] = useState('');

    const isEditing = !!task;

    const taskList = listId ? taskListData : null;

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setPriority(task.priority);
            setStatus(task.status);
            setDueDate(new Date(task.dueDate).toISOString().split('T')[0]);
        } else {
            setTitle('');
            setDescription('');
            setPriority('MEDIUM');
            setStatus('OPEN');
            setDueDate(new Date().toISOString().split('T')[0]);
        }
    }, [task, open]);

    const handleCreateTask = async (taskListId: string, formData: Omit<Task, 'id' | 'created' | 'updated'>) => {
        try {
            const response = await api.createTask(taskListId, formData);

            toast.success(`Task "${formData.title}" has been added to ${taskList?.title}.`);
            console.log(response)

        } catch (error) {
            toast.error('Failed to create new Task.');
        }
    };

    const handleUpdateTask = async (taskListId: string, taskId: string, formData: Omit<Task, 'id' | 'created' | 'updated'>) => {
        if (!taskId || !taskListId) return;
        try {
            const response = await api.updateTask(taskListId, taskId,
                {
                    ...formData,
                    id: taskId,
                });

            toast.success(`Task "${formData.title}" has been updated.`);
            console.log(response)

        } catch (error) {
            toast.error('Failed to create new Task.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.warning('Task title is required.');
            return;
        }

        if (!listId) {
            toast.error('Your are trying to update the Task list improperly!');
            return;
        }

        const taskData = {
            title: title.trim(),
            description: description.trim(),
            priority,
            status,
            dueDate: new Date(dueDate).toISOString().split(".")[0],
        };

        if (isEditing && task) {
            await handleUpdateTask(listId, task.id, taskData);
        } else {
            await handleCreateTask(listId, taskData);
        }

        onClose();
    };

    const handleClose = (open: boolean) => {
        onOpenChange(open);
        if (!open) onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit Task' : `Add Task to " ${taskList?.title} "`}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter task title"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter task description (optional)"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select value={priority} onValueChange={(value: TaskPriority) => setPriority(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LOW">Low</SelectItem>
                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                    <SelectItem value="HIGH">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Select
                                            value={status}
                                            onValueChange={(value: TaskStatus) => setStatus(value)}
                                            disabled={!isEditing}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="OPEN">Open</SelectItem>
                                                <SelectItem value="CLOSED">Closed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Default Open for new Task.
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                            id="dueDate"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => handleClose(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-primary">
                            {isEditing ? 'Update Task' : 'Create Task'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}