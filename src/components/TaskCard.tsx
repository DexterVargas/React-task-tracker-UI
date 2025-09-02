import type { Task } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface TaskCardProps {
    task: Task;
    onToggleStatus: (taskId: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
}

const priorityConfig = {
    HIGH: { color: 'priority-high', label: 'High' },
    MEDIUM: { color: 'priority-medium', label: 'Medium' },
    LOW: { color: 'priority-low', label: 'Low' },
};

export function TaskCard({
    task,
    onToggleStatus,
    onEdit,
    onDelete
}: TaskCardProps) {
    const isCompleted = task.status === 'CLOSED';
    const isOverdue = new Date(task.dueDate) < new Date() && !isCompleted;
    const priority = priorityConfig[task.priority];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <Card className={cn(
            'group hover:shadow-md transition-all duration-300 border-l-4',
            isCompleted && 'opacity-75',
            task.priority === 'HIGH' && 'border-l-priority-high',
            task.priority === 'MEDIUM' && 'border-l-priority-medium',
            task.priority === 'LOW' && 'border-l-priority-low'
        )}>
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => onToggleStatus(task.id)}
                        className="mt-1 data-[state=checked]:bg-success data-[state=checked]:border-success"
                    />

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className={cn(
                                'font-medium text-card-foreground line-clamp-1',
                                isCompleted && 'line-through text-muted-foreground'
                            )}>
                                {task.title}
                            </h4>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => onEdit(task)}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Are you sure you want to delete task from your list?
                                            </AlertDialogTitle>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => onDelete(task.id)}
                                                className="bg-red-600 text-white hover:bg-red-700"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>

                        {task.description && (
                            <p className={cn(
                                'text-sm text-muted-foreground mb-3 line-clamp-2',
                                isCompleted && 'line-through'
                            )}>
                                {task.description}
                            </p>
                        )}

                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Badge
                                    className={cn(
                                        'text-xs font-medium px-2 py-1 border',
                                        task.priority === 'HIGH' && 'bg-priority-high/10 text-priority-high border-priority-high/20',
                                        task.priority === 'MEDIUM' && 'bg-priority-medium/10 text-priority-medium border-priority-medium/20',
                                        task.priority === 'LOW' && 'bg-priority-low/10 text-priority-low border-priority-low/20'
                                    )}
                                    variant="outline"
                                >
                                    {priority.label}
                                </Badge>

                                {isOverdue && (
                                    <Badge variant="destructive" className="text-xs">
                                        Overdue
                                    </Badge>
                                )}
                            </div>

                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(task.dueDate)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}