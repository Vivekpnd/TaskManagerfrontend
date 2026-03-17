"use client";

import Header from "../components/Header";
import ProtectedRoute from "../components/ProtectedRoute";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>

      <div className="flex flex-col md:flex-row min-h-screen bg-[#F5F7FB] px-1.5">

        {/* DESKTOP SIDEBAR */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="flex flex-col flex-1">

          {/* HEADER */}
          <Header />

          
          <div className="md:hidden">
            <Sidebar />
          </div>

          {/* CONTENT */}
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>

        </div>

      </div>

    </ProtectedRoute>
  );
}