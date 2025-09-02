import { useEffect, useState, useCallback } from "react";
import { TaskApiService } from "@/services/taskApi";
import type { TaskList } from "@/types";
import { TaskListCard } from '@/components/TaskListCard';
import { TaskDialog } from '@/components/TaskDialog';
import { TaskListDialog } from '@/components/TaskListDialog';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle2, Clock, BarChart3 } from 'lucide-react';
import { toast } from "sonner"



import Spinner from './Spinner';
import Footer from "@/components/shared/Footer";
const api = new TaskApiService();

const List = () => {
    const [taskLists, setTaskLists] = useState<TaskList[]>([]);
    const [loading, setLoading] = useState(true);

    // Arelt Delete
    const [deleteId, setDeleteId] = useState<string | null>(null);
    // To open TaskList Dialog state Management
    const [isTaskListDialogOpen, setIsTaskListDialogOpen] = useState(false);

    const [isCreating, setIsCreating] = useState(false);

    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [editingTaskList, setEditingTaskList] = useState<TaskList | null>(null);
    const [activeListId, setActiveListId] = useState<string | null>(null);
    const [activeListIdData, setActiveListIdData] = useState<TaskList | null>(null);
    const totalTasks = taskLists.reduce((sum, list) => sum + list.tasks.length, 0);
    const completedTasks = taskLists.reduce((sum, list) =>
        sum + list.tasks.filter(task => task.status === 'CLOSED').length, 0
    );
    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;


    const handleCreateTaskList = async (data: Omit<TaskList, 'id' | 'created' | 'updated' | 'tasks'>) => {
        // createTaskList(data);
        try {
            setIsCreating(true); // show spinner
            await api.createTaskList(data);

            toast.success(`Task list "${data.title}" has been created successfully.`);
            await fetchTaskLists();
            console.log(data)
            setIsTaskListDialogOpen(false);
        } catch (error) {
            toast.error('Failed to create task list.');
        } finally {
            setIsCreating(false); // hide spinner
        }
    };

    const handleUpdateTaskList = async (data: Omit<TaskList, 'id' | 'created' | 'updated' | 'tasks'>) => {
        if (!editingTaskList) return;
        try {
            setIsCreating(true); // show spinner
            await api.updateTaskList(
                editingTaskList.id,
                {
                    ...data,
                    id: editingTaskList.id, // enforce correct id
                });


            toast.success(`Task list "${data.title}" has been updated successfully.`);
            await fetchTaskLists();
            setEditingTaskList(null);
            setIsTaskListDialogOpen(false);
        } catch (error) {
            toast.error('Failed to update task list.');
        } finally {
            setIsCreating(false); // hide spinner
        }
    };

    const handleDeleteTaskList = async (taskListId: string) => {
        console.log(taskListId)
        const list = taskLists.find(l => l.id === taskListId);
        if (!list) return;

        try {
            await api.deleteTaskList(taskListId);
            toast.success(`Task List "${list.title}" has been deleted.`);
            await fetchTaskLists();
        } catch (error) {
            toast.error('Failed to delete task list.');
            console.error(error);
        }
    };

    const handleEditTaskList = (taskList: TaskList) => {
        setEditingTaskList(taskList);
        setIsTaskListDialogOpen(true);
    };

    const handleAddTask = async (listId: string) => {
        console.log("Must show add task dialog")
        setActiveListId(listId);
        setIsTaskDialogOpen(true);
        setActiveListIdData(taskLists.find(list => list.id === listId) || null);
    };

    useEffect(() => {
        fetchTaskLists();
    }, []);

    const fetchTaskLists = useCallback(async () => {
        try {
            setLoading(true);
            const taskLists: TaskList[] = await api.getTaskList();
            console.log("Fetched: ", taskLists);

            // sort the freshly fetched list, not the old state
            const sortedTaskLists = [...taskLists].sort(
                (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime() // newest first
            );

            console.log("Sorted: ", sortedTaskLists);
            setTaskLists(sortedTaskLists);
        } catch (err) {
            console.error("Error fetching task lists:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleViewTasks = (taskListId: string) => {
        // Navigate to the detailed task view
        window.location.href = `/list/${taskListId}`;
    };

    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-gradient-primary text-white">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="inline-block py-0.5 pl-3 text-heading z-20 relative before:content-[''] before:absolute before:w-2/3 before:ml-20 before:top-0 before:left-0 before:bottom-0 before:-z-10 before:bg-indigo-400 font-['Caveat']">
                                <i className="text-3xl text-white/90"> 📝TASKito | <small>Task Tracking App</small></i>
                            </h1>
                            <p className="text-white/90 ml-20">Organize your tasks and boost productivity</p>
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
                                <p className="text-sm text-muted-foreground">Overall Progress</p>
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

                                const taskCLOSED = taskList.tasks.filter(task => task.status === 'CLOSED').length;

                                return (
                                    <TaskListCard
                                        key={taskList.id}
                                        taskList={taskList}
                                        stats={{ total: Number(taskList.count), completed: taskCLOSED, progress: Number(taskList.progress) * 100 }}
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
                isCreating={isCreating}
            />

            <TaskDialog
                open={isTaskDialogOpen}
                onOpenChange={setIsTaskDialogOpen}
                listId={activeListId}
                onClose={async () => {
                    setIsTaskDialogOpen(false);
                    setActiveListId(null);
                    await fetchTaskLists();
                }}
                taskListData={activeListIdData}
            />

            <Footer />
        </div>
    );
}

export default List