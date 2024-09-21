'use client';
import React, { useState } from 'react';
import { Task, TaskStatus } from '../type/task';


interface TaskItemProps extends Task {
  onDelete: (taskId?: string) => void;
  onUpdate: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = (props) => {
  const [isDone, setIsDone] = useState(props.is_done);

  const toggleIsDone = () => {
    const newIsDoneValue = isDone === TaskStatus.Pending ? TaskStatus.Completed : TaskStatus.Pending;
    setIsDone(newIsDoneValue);
    return newIsDoneValue;
   
  };

  const handleTaskUpdate = async () => {
    const updatedTask = {
      created_time: Math.floor(Date.now() / 1000),
      task_id: props.task_id,
      user_id: props.user_id,
      description: props.description,
      is_done: toggleIsDone(),
    };
    props.onUpdate(updatedTask);
  };

  const formatCreateTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const taskClasses = isDone === TaskStatus.Completed ? 'text-green-500 font-bold' : '';

   // Create a task item with a check box.
   const taskItem = (
    <div className={`border border-gray-300 rounded-md p-3 mb-2 flex items-center ${taskClasses}`}>
      <div className="mr-2">{formatCreateTime(props.created_time)}</div>
      <div className="flex-grow ml-2">{props.description}</div>
      <div className="mr-2">
        <input
          type="checkbox"
          checked={isDone === TaskStatus.Completed}
          onChange={handleTaskUpdate}
          className="cursor-pointer"
        />
      </div>
      <div className="ml-2">
        {isDone === TaskStatus.Completed ? 'Completed' : 'Pending'}
      </div>
      <button
        className="text-red-500 ml-4"
        onClick={() => {
        props.onDelete(props.task_id);
        }}
        >
        Delete
      </button>
    </div>
  );
  return taskItem;

};

export default TaskItem;
