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
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 space-y-8 overflow-x-hidden">

        {/* ================= HEADER ================= */}
        <Card className="bg-slate-800 border border-slate-700 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 rounded-lg">
          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                <span className="text-2xl">🏆</span>
              </div>
              <span className="text-xl">⚙️</span>
              Admin Panel
            </h2>

            <nav className="flex items-center gap-2">
              <Link to="/admin/athletes" className={navLink("/admin/athletes")}>
                <span>👥</span>
                Athletes
              </Link>
              <Link to="/admin/events" className={navLink("/admin/events")}>
                <span>📅</span>
                Events
              </Link>
              <Link to="/admin/results" className={navLink("/admin/results")}>
                <span>🏆</span>
                Results
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
