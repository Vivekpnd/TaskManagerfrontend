"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  PlusCircle,
  User,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  const linkStyle = (path: string) =>
    [
      "group relative inline-flex shrink-0 items-center gap-3",
      "h-11 min-w-fit whitespace-nowrap rounded-xl px-4",
      "text-[13px] font-medium transition-all duration-200",
      pathname === path
        ? "bg-[#EEF2FF] text-[#2563EB]"
        : "text-gray-500 hover:bg-gray-100",
    ].join(" ");

  return (
    <aside
      className="
        !mt-[10px] rounded-[18px] border border-gray-200 bg-white
        px-3 py-3 shadow-[0_4px_8px_rgba(0,0,0,0.04)]
        md:sticky md:top-0 md:mt-0 md:flex md:h-screen md:w-[240px] md:flex-col md:justify-between
        md:self-start md:rounded-[18px] md:border-r lg:mr-[10px] 
      "
    >
      <div className="flex h-full flex-col">
        <h1 className="mb-4 hidden text-[15px] font-semibold tracking-wide text-[#2563EB] md:block">
          Athratech Pvt Limited
        </h1>

        <nav className="min-w-0">
          <div
            className="
              flex items-center gap-2 overflow-x-auto overflow-y-hidden pb-1
              scrollbar-hide md:flex-col md:items-stretch md:overflow-visible md:pb-0
            "
          >
            <Link href="/dashboard" className={linkStyle("/dashboard")}>
              {pathname === "/dashboard" && (
                <span className="absolute left-0 top-1/2 hidden h-6 w-1.5 -translate-y-1/2 rounded-r-full bg-[#2563EB] md:block" />
              )}
              <LayoutDashboard
                size={18}
                className="shrink-0 transition group-hover:scale-110"
              />
              <span className="truncate">Dashboard</span>
            </Link>

            <Link
              href="/dashboard/all-tasks"
              className={linkStyle("/dashboard/add-task")}
            >
              {pathname === "/dashboard/add-task" && (
                <span className="absolute left-0 top-1/2 hidden h-6 w-1.5 -translate-y-1/2 rounded-r-full bg-[#2563EB] md:block" />
              )}
              <User
                size={18}
                className="shrink-0 transition group-hover:scale-110"
              />
              <span className="truncate">All Task</span>
            </Link>

            <button
              onClick={logout}
              className="
                group inline-flex h-11 min-w-fit shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-4
                text-[13px] font-medium text-red-500 transition-all duration-200 hover:bg-red-50
                md:mt-6 md:w-full
              "
              type="button"
            >
              <LogOut
                size={18}
                className="shrink-0 transition group-hover:scale-110"
              />
              <span className="truncate">Log Out</span>
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
}