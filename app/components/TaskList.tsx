"use client";

import { api } from "@/lib/api";
import {
  Trash2,
  RefreshCcw,
  CalendarDays,
  Flag,
  Loader2,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import EditTaskModal from "./EditTaskModal";

type Task = {
  id: string;
  title: string;
  description?: string | null;
  priority?: string | null;
  status: "pending" | "in-progress" | "completed";
  dueDate?: string | null;
  createdAt?: string;
};

type TaskListProps = {
  tasks: Task[];
  refresh: () => void;
};

export default function TaskList({ tasks, refresh }: TaskListProps) {
  const [actionId, setActionId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const deleteTask = async (id: string) => {
    try {
      setActionId(id);
      await api.delete(`/tasks/${id}`);
      refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete task");
    } finally {
      setActionId(null);
    }
  };

  const toggleTask = async (id: string) => {
    try {
      setActionId(id);
      await api.patch(`/tasks/${id}/toggle`);
      refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to update task status");
    } finally {
      setActionId(null);
    }
  };

  const openEdit = (task: Task) => {
    setSelectedTask(task);
    setEditOpen(true);
  };

  const priorityStyles: Record<string, string> = {
    low: "border-emerald-200 bg-emerald-50 text-emerald-700",
    medium: "border-amber-200 bg-amber-50 text-amber-700",
    high: "border-rose-200 bg-rose-50 text-rose-700",
  };

  const statusStyles: Record<string, string> = {
    pending: "bg-gray-100 text-gray-700",
    "in-progress": "bg-blue-100 text-blue-700",
    completed: "bg-emerald-100 text-emerald-700",
  };

  return (
    <>
      <div className="space-y-4">
        {tasks.map((task) => {
          const isLoading = actionId === task.id;

          return (
            <div
              key={task.id}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-300 hover:shadow-md sm:p-5"
            >
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-start gap-2">
                    <h3 className="min-w-0 flex-1 break-words text-sm font-semibold leading-6 text-gray-900 sm:text-base">
                      {task.title}
                    </h3>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold sm:text-xs ${
                        statusStyles[task.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <p className="mt-2 break-words text-sm leading-6 text-gray-500">
                    {task.description || "No description added."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span
                      className={`inline-flex max-w-full items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold sm:text-xs ${
                        priorityStyles[task.priority || "medium"] ||
                        priorityStyles.medium
                      }`}
                    >
                      <Flag size={12} className="shrink-0" />
                      <span className="truncate">
                        {task.priority || "medium"}
                      </span>
                    </span>

                    <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600 sm:text-xs">
                      <CalendarDays size={12} className="shrink-0" />
                      <span className="truncate">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No due date"}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 xl:grid-cols-1 xl:w-[150px]">
                  <button
                    onClick={() => openEdit(task)}
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <Pencil size={15} className="shrink-0" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => toggleTask(task.id)}
                    disabled={isLoading}
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-3 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? (
                      <Loader2 size={15} className="shrink-0 animate-spin" />
                    ) : (
                      <RefreshCcw size={15} className="shrink-0" />
                    )}
                    <span>Update</span>
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    disabled={isLoading}
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 size={15} className="shrink-0" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <EditTaskModal
        task={selectedTask}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onUpdated={refresh}
      />
    </>
  );
}