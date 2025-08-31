export type TaskStatus = 'OPEN' | 'CLOSED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdDate: string;
  updatedDate: string;
}

export interface TaskList {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  count?: number;
  progress?: number;
  createdDate: string;
  updatedDate: string;
}

export interface TaskListStats {
  total: number;
  completed: number;
  progress: number;
}