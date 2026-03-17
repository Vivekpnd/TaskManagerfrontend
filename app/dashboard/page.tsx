"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import AddTask from "./add-task/page";
import TaskList from "../components/TaskList";
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

export default function DashboardPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.replace("/login");
      return;
    }

    setAuthenticated(true);
    setCheckingAuth(false);
  }, [router]);

  const loadTasks = async (
    customPage = page,
    customSearch = search,
    customStatus = status
  ) => {
    try {
      setLoading(true);

      const res = await api.get<TasksResponse>("/tasks", {
        params: {
          page: customPage,
          limit: 5,
          search: customSearch || undefined,
          status: customStatus || undefined,
        },
      });

      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages || 1);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        router.replace("/login");
        return;
      }

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      loadTasks(page, search, status);
    }
  }, [authenticated, page, search, status]);

  const refresh = () => {
    loadTasks(page, search, status);
  };

  if (checkingAuth) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        <Loader2 className="mr-2 animate-spin" size={20} />
        Checking authentication...
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-[#F7F8FC] p-1 md:p-2">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <div>
            <AddTask refresh={refresh} />
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex w-full items-center rounded-2xl bg-gray-100 px-4 py-3 md:max-w-[360px]">
                  <Search size={18} className="mr-3 text-gray-400" />
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

                <div className="flex items-center gap-2 self-start rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
                  <Filter size={18} className="text-gray-400" />
                  <select
                    value={status}
                    onChange={(e) => {
                      setPage(1);
                      setStatus(e.target.value);
                    }}
                    className="bg-transparent text-sm text-gray-700 outline-none"
                  >
                    <option value="">All Tasks</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-900 text-white">
                  <ClipboardList size={20} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Your Tasks
                  </h2>
                  <p className="text-sm text-gray-500">
                     tasks page
                  </p>
                </div>
              </div>

              <div className="p-5">
                {loading ? (
                  <div className="flex min-h-[260px] items-center justify-center text-gray-500">
                    <Loader2 className="mr-2 animate-spin" size={20} />
                    Loading tasks...
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
                    <div className="mb-4 rounded-full bg-gray-100 p-4">
                      <ClipboardList size={28} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      No tasks found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Create a task or change your filters.
                    </p>
                  </div>
                ) : (
                  <TaskList tasks={tasks} refresh={refresh} />
                )}

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                    Prev
                  </button>

                  <span className="rounded-2xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page >= totalPages}
                    className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}