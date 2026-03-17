"use client";

import { useEffect, useState } from "react";
import { Search, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

type StoredUser = {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  address?: string | null;
  avatar?: string | null;
};

export default function Header({
  onSearch,
}: {
  onSearch?: (value: string) => void;
}) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const rawUser = localStorage.getItem("user");

    if (rawUser) {
      try {
        setUser(JSON.parse(rawUser) as StoredUser);
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        setUser(null);
      }
    }
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    onSearch?.(value);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  const displayName = user?.name?.trim() || "User";
  const displayEmail = user?.email || "";
  const displayAvatar =
    user?.avatar?.trim() || "https://i.pravatar.cc/40?img=12";

  return (
    <header className="mt-[10px] rounded-[18px] border border-gray-200 bg-white px-4 py-3 shadow-sm md:px-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3 sm:items-center">
          <div className="min-w-0">
            <h1 className="text-[15px] font-semibold tracking-wide text-gray-800 md:text-[16px]">
              Dashboard
            </h1>
            <p className="mt-1 text-xs text-gray-400 sm:hidden">
              Welcome back
            </p>
          </div>

          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="flex min-w-0 items-center gap-2 rounded-xl border border-gray-200 px-2 py-1.5 sm:pl-2 sm:pr-3">
              <img
                src={displayAvatar}
                alt={displayName}
                className="h-9 w-9 shrink-0 rounded-full border border-gray-200 object-cover"
              />

              <div className="min-w-0 leading-tight">
                <span className="block truncate text-[12px] font-semibold text-gray-800 sm:text-[13px]">
                  {displayName}
                </span>
                <span className="block truncate text-[11px] text-gray-400">
                  {displayEmail}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}