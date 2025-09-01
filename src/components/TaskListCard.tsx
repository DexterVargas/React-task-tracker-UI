import type { TaskList } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog"

import { Plus, Edit2, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskListCardProps {
    taskList: TaskList;
    stats: { total: number; completed: number; progress: number };
    // onAddTask: (taskListId: string) => void;
    onEditList: (taskList: TaskList) => void;
    onDeleteList: (taskListId: string) => void;
    onViewTasks: (taskListId: string) => void;
}

export function TaskListCard({
    taskList,
    stats,
    // onAddTask, 
    onEditList,
    onDeleteList,
    onViewTasks
}: TaskListCardProps) {

    const hasCompletedTasks = stats.completed > 0;
    const isEmpty = stats.total === 0;

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-card border-0">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold text-card-foreground line-clamp-1">
                            {taskList.title}
                        </CardTitle>
                        {taskList.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {taskList.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => onEditList(taskList)}
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
                                        Are you sure you want to delete this list?
                                    </AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => onDeleteList(taskList.id)}
                                        className="bg-red-600 text-white hover:bg-red-700"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Progress Section */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className={cn(
                            'font-medium',
                            hasCompletedTasks && 'text-success'
                        )}>
                            {stats.completed} of {stats.total} tasks
                        </span>
                    </div>

                    <Progress
                        value={stats.progress}
                        className="h-2"
                    />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3 text-success" />
                                <span>{stats.completed} completed</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{stats.total - stats.completed} pending</span>
                            </div>
                        </div>

                        {stats.progress === 100 && stats.total > 0 && (
                            <Badge className="bg-success/10 text-success border-success/20 text-xs">
                                Complete!
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => onViewTasks(taskList.id)}
                    >
                        View Tasks
                    </Button>
                    <Button
                        size="sm"
                        className="bg-gradient-primary hover:opacity-90 border-0"
                    // onClick={() => onAddTask(taskList.id)}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Task
                    </Button>
                </div>

                {isEmpty && (
                    <div className="text-center py-4 text-muted-foreground">
                        <p className="text-sm">No tasks yet</p>
                        <p className="text-xs">Add your first task to get started</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}