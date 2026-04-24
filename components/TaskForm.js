"use client";

import { useState } from "react";

export default function TaskForm({ addTask }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return alert("Enter task");

    try {
      setLoading(true);

      await addTask({
        title: title.trim(),
        status: "todo",
        priority: "medium",
      });

      setTitle("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex">
      <input
        type="text"
        placeholder="Enter task"
        className="border p-2 mr-2 flex-1 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}