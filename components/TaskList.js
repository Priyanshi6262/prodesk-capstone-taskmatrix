"use client";

export default function TaskList({ tasks = [], onEdit, onDelete }) {
  if (tasks.length === 0) {
    return <p className="text-gray-500">No tasks to display.</p>;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="border p-4 rounded-lg flex flex-col md:flex-row md:justify-between md:items-center shadow-sm"
        >
          <div>
            <p className="font-semibold text-lg">{task.title}</p>
            <p className="text-sm">Status: {task.status}</p>
            <p className="text-sm">Priority: {task.priority}</p>
          </div>

          <div className="flex gap-2 mt-3 md:mt-0">
            <button
              type="button"
              onClick={() => onEdit?.(task)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(task.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
