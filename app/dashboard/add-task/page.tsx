"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import {
  Plus,
  Loader2,
  CalendarDays,
  AlignLeft,
  Flag,
  FileText,
} from "lucide-react";

type AddTaskProps = {
  refresh: () => void;
};

export default function AddTask({ refresh }: AddTaskProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      setLoading(true);

      await api.post("/tasks", {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
      });

      resetForm();
      refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={createTask}
      className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Create Task</h2>
        <p className="mt-1 text-sm text-gray-500">
          Add title, description, priority and due date
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText size={16} className="text-gray-500" />
            Title
          </label>
          <input
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            required
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
            <AlignLeft size={16} className="text-gray-500" />
            Description
          </label>
          <textarea
            rows={4}
            placeholder="Write task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
              <Flag size={16} className="text-gray-500" />
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
              <CalendarDays size={16} className="text-gray-500" />
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
          Assigned By: <span className="font-medium text-gray-700">Current logged-in user</span>
        </div>

        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus size={18} />
              Add Task
            </>
          )}
        </button>
      </div>
    </form>
  );
}