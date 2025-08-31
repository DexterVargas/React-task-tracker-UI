import { useState, useEffect } from 'react';
import type { TaskList } from '@/types';
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
import { useToast } from '@/hooks/use-toast';

interface TaskListDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    taskList?: TaskList | null;
    onSubmit: (data: Omit<TaskList, 'id' | 'createdDate' | 'updatedDate' | 'tasks'>) => void;
}

export const TaskListDialog = ({ open, onOpenChange, taskList, onSubmit }: TaskListDialogProps) => {

    const { toast } = useToast();

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('')

    const isEditing = !!taskList;

    useEffect(() => {
        if (taskList) {
            setTitle(taskList.title);
            setDesc(taskList.description);
        } else {
            setTitle('');
            setDesc('');
        }
    }, [taskList, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast({
                title: 'Error',
                description: 'Task list title is required.',
                variant: 'destructive',
            });
            return;
        }

        onSubmit({
            title: title.trim(),
            description: desc.trim(),
        });

        // Reset form
        setTitle('');
        setDesc('');
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit Task List' : 'Create New Task List'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter task list title"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            placeholder="Enter task list description (optional)"
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-primary">
                            {isEditing ? 'Update List' : 'Create List'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}