"use client";

import { useState } from "react";

export default function TaskForm({ addTask }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title) return;

    addTask({
      title,
      status: "todo",
      priority: "medium",
    });

    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        placeholder="Enter task"
        className="border p-2 mr-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Task
      </button>
    </form>
  );
}