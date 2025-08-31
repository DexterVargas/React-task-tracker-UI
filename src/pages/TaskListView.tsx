import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskStore } from '@/hooks/useTaskStore';
import type { Task } from '@/types';
import { TaskCard } from '@/components/TaskCard';
import { TaskDialog } from '@/components/TaskDialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Plus,
    CheckCircle2,
    Clock,
    Calendar,
    Filter,
    SortAsc
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function TaskListView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        getTaskList,
        getTaskListStats,
        updateTask,
        deleteTask
    } = useTaskStore();
    const { toast } = useToast();

    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed'>('all');
    const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
    const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'created'>('dueDate');

    if (!id) {
        navigate('/');
        return null;
    }

    const taskList = getTaskList(id);
    const stats = getTaskListStats(id);

    if (!taskList) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-2">Task list not found</h1>
                    <p className="text-muted-foreground mb-4">The task list you're looking for doesn't exist.</p>
                    <Button onClick={() => navigate('/')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    // Filter and sort tasks
    let filteredTasks = taskList.tasks;

    // Apply status filter
    if (filterStatus !== 'all') {
        filteredTasks = filteredTasks.filter(task =>
            filterStatus === 'open' ? task.status === 'OPEN' : task.status === 'CLOSED'
        );
    }

    // Apply priority filter
    if (filterPriority !== 'all') {
        filteredTasks = filteredTasks.filter(task =>
            task.priority.toLowerCase() === filterPriority
        );
    }

    // Apply sorting
    filteredTasks = [...filteredTasks].sort((a, b) => {
        switch (sortBy) {
            case 'dueDate':
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            case 'priority':
                const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            case 'created':
                return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
            default:
                return 0;
        }
    });

    const handleToggleTaskStatus = (taskId: string) => {
        const task = taskList.tasks.find(t => t.id === taskId);
        if (!task) return;

        const newStatus = task.status === 'OPEN' ? 'CLOSED' : 'OPEN';
        updateTask(id, taskId, { status: newStatus });

        toast({
            title: newStatus === 'CLOSED' ? 'Task completed' : 'Task reopened',
            description: `"${task.title}" marked as ${newStatus.toLowerCase()}.`,
        });
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsTaskDialogOpen(true);
    };

    const handleDeleteTask = (taskId: string) => {
        const task = taskList.tasks.find(t => t.id === taskId);
        if (!task) return;

        if (confirm(`Delete "${task.title}"?`)) {
            deleteTask(id, taskId);
            toast({
                title: 'Task deleted',
                description: `"${task.title}" has been deleted.`,
                variant: 'destructive',
            });
        }
    };

    const handleAddTask = () => {
        setEditingTask(null);
        setIsTaskDialogOpen(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-gradient-primary text-white">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/')}
                            className="text-white hover:bg-white/20"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </div>

                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold mb-2">{taskList.title}</h1>
                            {taskList.description && (
                                <p className="text-white/90 mb-4">{taskList.description}</p>
                            )}

                            <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Created {formatDate(taskList.createdDate)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>Updated {formatDate(taskList.updatedDate)}</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleAddTask}
                            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                            variant="outline"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Task
                        </Button>
                    </div>
                </div>
            </div>

            {/* Progress Section */}
            <div className="container mx-auto px-6 py-6">
                <div className="bg-card rounded-lg p-6 border shadow-sm mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" />
                            Progress Overview
                        </h2>
                        <Badge variant={stats?.progress === 100 ? 'default' : 'secondary'} className="bg-success/10 text-success border-success/20">
                            {stats?.progress}% Complete
                        </Badge>
                    </div>

                    <div className="space-y-3">
                        <Progress value={stats?.progress || 0} className="h-3" />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{stats?.completed || 0} of {stats?.total || 0} tasks completed</span>
                            <span>{(stats?.total || 0) - (stats?.completed || 0)} remaining</span>
                        </div>
                    </div>
                </div>

                {/* Filters and Sort */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Filters:</span>
                    </div>

                    <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filterPriority} onValueChange={(value: any) => setFilterPriority(value)}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priority</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2 ml-4">
                        <SortAsc className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Sort by:</span>
                    </div>

                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="dueDate">Due Date</SelectItem>
                            <SelectItem value="priority">Priority</SelectItem>
                            <SelectItem value="created">Created</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="ml-auto text-sm text-muted-foreground">
                        Showing {filteredTasks.length} of {taskList.tasks.length} tasks
                    </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-4">
                    {filteredTasks.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="max-w-md mx-auto">
                                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">
                                    {taskList.tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
                                </h3>
                                <p className="text-muted-foreground mb-6">
                                    {taskList.tasks.length === 0
                                        ? 'Add your first task to get started with this list.'
                                        : 'Try adjusting your filters to see more tasks.'
                                    }
                                </p>
                                {taskList.tasks.length === 0 && (
                                    <Button onClick={handleAddTask} className="bg-gradient-primary">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add First Task
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        filteredTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onToggleStatus={handleToggleTaskStatus}
                                onEdit={handleEditTask}
                                onDelete={handleDeleteTask}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Task Dialog */}
            <TaskDialog
                open={isTaskDialogOpen}
                onOpenChange={setIsTaskDialogOpen}
                listId={id}
                task={editingTask}
                onClose={() => {
                    setIsTaskDialogOpen(false);
                    setEditingTask(null);
                }}
            />
        </div>
    );
}