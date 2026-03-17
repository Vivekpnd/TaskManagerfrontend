"use client";

import { api } from "@/lib/api";

export default function TaskList({ tasks, refresh }: any) {
  const deleteTask = async (id: string) => {
    await api.delete(`/tasks/${id}`);
    refresh();
  };

  const toggleTask = async (id: string) => {
    await api.patch(`/tasks/${id}/toggle`);
    refresh();
  };

  return (
    <div className="bg-white rounded shadow">
      {tasks.map((task: any) => (
        <div
          key={task.id}
          className="flex justify-between border-b p-4"
        >
          <span
            onClick={() => toggleTask(task.id)}
            className={`cursor-pointer ${
              task.status ? "line-through text-gray-400" : ""
            }`}
          >
            {task.title}
          </span>

          <button
            onClick={() => deleteTask(task.id)}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}