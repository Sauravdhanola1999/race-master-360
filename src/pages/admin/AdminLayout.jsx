import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminLayout() {
  const location = useLocation();

  const navLink = (path) =>
    cn(
      "text-sm font-medium px-4 py-2 rounded-lg transition-all flex items-center",
      location.pathname.startsWith(path)
        ? "bg-green-600 text-white shadow-md"
        : "text-slate-300 hover:bg-slate-700 hover:text-white"
    );

  return (
    <div className="relative min-h-screen overflow-hidden track-field-bg">

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-6 sm:space-y-8 overflow-x-hidden">

        {/* ================= HEADER ================= */}
        <Card className="bg-slate-800 border border-slate-700 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 rounded-lg">
          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                <span className="text-xl sm:text-2xl">🏆</span>
              </div>
              <span className="text-lg sm:text-xl">⚙️</span>
              <span className="hidden xs:inline">Admin Panel</span>
              <span className="xs:hidden">Admin</span>
            </h2>

            <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <Link to="/admin/athletes" className={navLink("/admin/athletes")}>
                <span className="hidden sm:inline">👥</span>
                <span className="sm:hidden">👥</span>
                <span className="hidden sm:inline ml-1">Athletes</span>
              </Link>
              <Link to="/admin/events" className={navLink("/admin/events")}>
                <span className="hidden sm:inline">📅</span>
                <span className="sm:hidden">📅</span>
                <span className="hidden sm:inline ml-1">Events</span>
              </Link>
              <Link to="/admin/heats" className={navLink("/admin/heats")}>
                <span className="hidden sm:inline">🔥</span>
                <span className="sm:hidden">🔥</span>
                <span className="hidden sm:inline ml-1">Heats</span>
              </Link>
              <Link to="/admin/results" className={navLink("/admin/results")}>
                <span className="hidden sm:inline">🏆</span>
                <span className="sm:hidden">🏆</span>
                <span className="hidden sm:inline ml-1">Results</span>
              </Link>
            </nav>
          </CardContent>
        </Card>

        {/* ================= PAGE CONTENT ================= */}
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
          <Outlet />
        </div>

      </div>
    </div>
  );
}
