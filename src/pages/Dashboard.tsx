import { useState } from 'react';
import { useTaskStore } from '@/hooks/useTaskStore';
import type { TaskList, Task } from '@/types';
import { TaskListCard } from '@/components/TaskListCard';
import { TaskDialog } from '@/components/TaskDialog';
import { TaskListDialog } from '@/components/TaskListDialog';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle2, Clock, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


export default function Dashboard() {
    const { taskLists, createTaskList, updateTaskList, deleteTaskList, getTaskListStats } = useTaskStore();
    const { toast } = useToast();

    const [isTaskListDialogOpen, setIsTaskListDialogOpen] = useState(false);
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [editingTaskList, setEditingTaskList] = useState<TaskList | null>(null);
    const [activeListId, setActiveListId] = useState<string | null>(null);

    // Calculate overall stats
    const totalTasks = taskLists.reduce((sum, list) => sum + list.tasks.length, 0);
    const completedTasks = taskLists.reduce((sum, list) =>
        sum + list.tasks.filter(task => task.status === 'CLOSED').length, 0
    );
    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const handleCreateTaskList = (data: Omit<TaskList, 'id' | 'createdDate' | 'updatedDate' | 'tasks'>) => {
        createTaskList(data);
        setIsTaskListDialogOpen(false);
        toast({
            title: 'Task list created',
            description: `"${data.title}" has been created successfully.`,
        });
    };

    const handleUpdateTaskList = (data: Omit<TaskList, 'id' | 'createdDate' | 'updatedDate' | 'tasks'>) => {
        if (!editingTaskList) return;

        updateTaskList(editingTaskList.id, data);
        setEditingTaskList(null);
        setIsTaskListDialogOpen(false);
        toast({
            title: 'Task list updated',
            description: `"${data.title}" has been updated successfully.`,
        });
    };

    const handleDeleteTaskList = (listId: string) => {
        const list = taskLists.find(l => l.id === listId);
        if (!list) return;

        if (list.tasks.length > 0) {
            if (!confirm(`Delete "${list.title}" and all its ${list.tasks.length} tasks?`)) {
                return;
            }
        }

        deleteTaskList(listId);
        toast({
            title: 'Task list deleted',
            description: `"${list.title}" has been deleted.`,
            variant: 'destructive',
        });
    };

    const handleEditTaskList = (taskList: TaskList) => {
        setEditingTaskList(taskList);
        setIsTaskListDialogOpen(true);
    };

    const handleAddTask = (listId: string) => {
        setActiveListId(listId);
        setIsTaskDialogOpen(true);
    };

    const handleViewTasks = (listId: string) => {
        // Navigate to the detailed task view
        window.location.href = `/list/${listId}`;
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-gradient-primary text-white">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Dexter Vargas Task Tracker</h1>
                            <p className="text-white/90">Organize your tasks and boost productivity</p>
                        </div>
                        <Button
                            onClick={() => setIsTaskListDialogOpen(true)}
                            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                            variant="outline"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            New Task List
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card rounded-lg p-6 border shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <BarChart3 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Task Lists</p>
                                <p className="text-2xl font-semibold">{taskLists.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-lg p-6 border shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Clock className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Tasks</p>
                                <p className="text-2xl font-semibold">{totalTasks}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-lg p-6 border shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-success/10 rounded-lg">
                                <CheckCircle2 className="h-5 w-5 text-success" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Completed</p>
                                <p className="text-2xl font-semibold">{completedTasks}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-lg p-6 border shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-warning/10 rounded-lg">
                                <BarChart3 className="h-5 w-5 text-warning" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Progress</p>
                                <p className="text-2xl font-semibold">{overallProgress}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Task Lists Grid */}
                <div>
                    <h2 className="text-xl font-semibold mb-6">Your Task Lists</h2>

                    {taskLists.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="max-w-md mx-auto">
                                <div className="mb-4">
                                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto" />
                                </div>
                                <h3 className="text-lg font-medium mb-2">No task lists yet</h3>
                                <p className="text-muted-foreground mb-6">
                                    Create your first task list to start organizing your work.
                                </p>
                                <Button
                                    onClick={() => setIsTaskListDialogOpen(true)}
                                    className="bg-gradient-primary"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Task List
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {taskLists.map((taskList) => {
                                const stats = getTaskListStats(taskList.id);
                                return (
                                    <TaskListCard
                                        key={taskList.id}
                                        taskList={taskList}
                                        stats={stats || { total: 0, completed: 0, progress: 0 }}
                                        onAddTask={handleAddTask}
                                        onEditList={handleEditTaskList}
                                        onDeleteList={handleDeleteTaskList}
                                        onViewTasks={handleViewTasks}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Dialogs */}
            <TaskListDialog
                open={isTaskListDialogOpen}
                onOpenChange={setIsTaskListDialogOpen}
                taskList={editingTaskList}
                onSubmit={editingTaskList ? handleUpdateTaskList : handleCreateTaskList}
            />

            <TaskDialog
                open={isTaskDialogOpen}
                onOpenChange={setIsTaskDialogOpen}
                listId={activeListId}
                onClose={() => {
                    setIsTaskDialogOpen(false);
                    setActiveListId(null);
                }}
            />
        </div>
    );
}