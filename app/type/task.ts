enum TaskStatus {
    Pending = 'Pending',
    Completed = 'Completed',
  }
  
  interface Task {
    created_time: number;
    task_id: string;
    user_id: string;
    description: string;
    is_done: TaskStatus
}

  
export { TaskStatus };
    export type { Task };
  