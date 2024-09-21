'use client'
import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect } from "react";
import { Task, TaskStatus } from "./type/task";
import TaskItem from "./components/TaskItem";
import { v4 as uuidv4 } from "uuid";

const Home: NextPage = () => {
  const todoApiEndpoint = process.env.NEXT_PUBLIC_API_URL;

  const userId: string = "KayBot";
  const [isLoading, setIsLoading] = React.useState(true);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [newTaskContent, setNewTaskContent] = React.useState("");

  const getTasks = async () => {
    setIsLoading(true);
    const response = await fetch(`${todoApiEndpoint}/list-tasks/${userId}`);
    const responseData = await response.json();

    // Convert raw JSON to tasks.
    const tasks: Task[] = responseData.tasks;
    console.log(tasks);
    setTasks(tasks);
    setIsLoading(false);
  };

  // Get the existing to-do items.
  useEffect(() => {
    getTasks();
  }, [userId]);

  const putTask = async (task: Task) => {
    // Put a local copy of this task into the state first for immediate feedback.
    setTasks([task, ...tasks]);

    const response = await fetch(`${todoApiEndpoint}/create-task`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    console.log(response);
    const responseData = await response.json();
    const taskId: string = responseData.task.task_id;
    console.log(`Successfully put task: ${taskId}`);
    getTasks();
  };

  const deleteTask = async (taskId?: string) => {
    // Remove it from the local task list.
    const newTasks = tasks.filter((task) => task.task_id !== taskId);
    setTasks(newTasks);

    // Delete task from table.
    const response = await fetch(`${todoApiEndpoint}/delete-task/${taskId}`, {
      method: "DELETE",
    });
    console.log(response);
  };

  const updateTask = async (updatedTask: Task) => {
    const response = await fetch(`${todoApiEndpoint}/update-task`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });
    console.log(response);
  };

  const addNewTask = async () => {
    const task: Task = {
      task_id: `task_${uuidv4()}`, // New task with UUID4
      user_id: userId,
      description: newTaskContent,
      is_done: TaskStatus.Pending,
      created_time: Math.floor(Date.now() / 1000),
    };
    setNewTaskContent("");
    await putTask(task);
  };

  // Create the task input field.
  const taskInputField = (
    <div className="flex mt-6">
      <input
        className="border border-gray-300 p-2 rounded-md grow mr-4"
        type="text"
        placeholder="Enter task here"
        value={newTaskContent}
        onChange={(e) => setNewTaskContent(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white w-24 p-2 rounded-md"
        onClick={addNewTask}
      >
        Add
      </button>
    </div>
  );

  // Create a list of the tasks.
  const taskList = (
    // Create task using index as key
    <div>
      {tasks.map((task) => (
        <TaskItem
          key={task.task_id}
          {...task}
          onDelete={deleteTask}
          onUpdate={updateTask}
        />
      ))}
    </div>
  );

  const loadingText: string = isLoading ? "Just a moment... We're brewing your tasks!" : "All set! Your tasks are ready to roll!";
  const loadingTextColor: string = isLoading
    ? "text-orange-500"
    : "text-green-500";
  const loadingStatus = (
    <div className={loadingTextColor + " text-center mb-4 text-sm"}>
      {loadingText}
    </div>
  );

  const userIdElement = (
    <div className="text-center text-gray-700">Welcome back: {userId}!</div>
  );

  return (
    <div className="flex justify-center min-h-screen">
      <Head>
        <title>To-Do List App</title>
        <meta name="description" content="To-do list app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-[800px] w-full h-auto">
        <h1 className="text-2xl font-bold text-center mt-3 mb-3">My Todo(s)</h1>
        <div className="mb-3">{userIdElement}</div>
        <div className="mb-3">{loadingStatus}</div>
        {taskList}
        {taskInputField}
      </main>
    </div>
  );
};

export default Home;