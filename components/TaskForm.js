"use client";

import { useState } from "react";

export default function TaskForm({ addTask }) {
  const [title, setTitle] = useState("");
  const [aiSteps, setAiSteps] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) return;

    await addTask({
      title,
      status: "todo",
      priority: "medium",
      aiSteps: aiSteps || "",
    });

    setTitle("");
    setAiSteps("");
  };

  const generateSteps = async () => {
    if (!title) return;
    setLoadingAI(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();

      if (data.result) {
        setAiSteps(data.result);
      } else {
        alert("AI failed to generate steps.");
      }
    } catch (err) {
      console.error(err);
      alert("Error generating AI steps.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          type="text"
          placeholder="Enter task"
          className="border p-2 rounded w-full md:flex-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <button
            type="button"
            onClick={generateSteps}
            disabled={!title || loadingAI}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {loadingAI ? "Generating..." : "Generate AI Steps"}
          </button>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Task
          </button>
        </div>
      </form>

      {aiSteps && (
        <div className="mt-4 rounded-lg border bg-slate-50 p-4 text-sm text-slate-800">
          <h3 className="font-semibold mb-2">AI-generated steps</h3>
          <p className="whitespace-pre-line">{aiSteps}</p>
        </div>
      )}
    </div>
  );
}
