"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import TaskList from "../../components/TaskList";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ClipboardList,
} from "lucide-react";

type Task = {
  id: string;
  title: string;
  description?: string | null;
  priority?: string | null;
  status: "pending" | "in-progress" | "completed";
  dueDate?: string | null;
  createdAt?: string;
};

type TasksResponse = {
  tasks: Task[];
  total: number;
  page: number;
  totalPages: number;
};

export default function AllTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const loadTasks = async (
    currentPage = page,
    currentSearch = search,
    currentStatus = status
  ) => {
    try {
      setLoading(true);

      const res = await api.get<TasksResponse>("/tasks", {
        params: {
          page: currentPage,
          limit: 5,
          search: currentSearch || undefined,
          status: currentStatus || undefined,
        },
      });

      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error(error);
      alert("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks(page, search, status);
  }, [page, search, status]);

  const refresh = () => {
    loadTasks(page, search, status);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="px-1">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          All Tasks
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View, update and manage all your tasks.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:rounded-3xl sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full items-center rounded-2xl bg-gray-100 px-4 py-3 lg:max-w-[380px]">
            <Search size={18} className="mr-3 shrink-0 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>

          <div className="flex w-full items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm sm:w-fit">
            <Filter size={18} className="shrink-0 text-gray-400" />
            <select
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
              className="w-full bg-transparent text-sm text-gray-700 outline-none sm:w-auto"
            >
              <option value="">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm sm:rounded-3xl">
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4 sm:px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-900 text-white sm:h-11 sm:w-11">
            <ClipboardList size={20} />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
              Task List
            </h2>
            <p className="text-xs text-gray-500 sm:text-sm">
              Showing  tasks
            </p>
          </div>
        </div>

        <div className="p-3 sm:p-5">
          {loading ? (
            <div className="flex min-h-[220px] items-center justify-center text-gray-500">
              <Loader2 className="mr-2 animate-spin" size={20} />
              Loading tasks...
            </div>
          ) : (
            <TaskList tasks={tasks} refresh={refresh} />
          )}

          <div className="mt-5 border-t border-gray-100 pt-4 sm:mt-6 sm:pt-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <ChevronLeft size={16} />
                Prev
              </button>

              <span className="inline-flex h-11 items-center justify-center rounded-2xl bg-gray-100 px-4 text-sm font-medium text-gray-600">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page >= totalPages}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}