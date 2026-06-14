"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

interface AdminShellProps {
  pendingOrders: number;
  adminName?: string;
  children: React.ReactNode;
}

export default function AdminShell({ pendingOrders, adminName, children }: AdminShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-light-bg">
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:right-0 lg:flex lg:w-64 lg:flex-col">
        <Sidebar pendingOrders={pendingOrders} adminName={adminName} />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative w-64 max-w-[80%] ms-auto h-full">
            <Sidebar
              pendingOrders={pendingOrders}
              adminName={adminName}
              onNavigate={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Mobile topbar */}
      <div className="lg:hidden sticky top-0 z-30 bg-dark-bg h-14 flex items-center justify-between px-4 border-b border-slate-700">
        <span className="text-white font-bold text-sm">زين العابدين - لوحة التحكم</span>
        <button
          onClick={() => setDrawerOpen(true)}
          className="text-slate-300 hover:text-white p-2 -m-2"
          aria-label="فتح القائمة"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Main content */}
      <main className="lg:pr-64">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
