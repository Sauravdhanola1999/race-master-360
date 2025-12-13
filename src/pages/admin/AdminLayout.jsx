import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminLayout() {
  const location = useLocation();

  const navLink = (path) =>
    cn(
      "text-sm font-medium px-3 py-1.5 rounded-md transition",
      location.pathname.startsWith(path)
        ? "bg-indigo-600 text-white"
        : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
    );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">

      {/* ===== BACKGROUND BLOBS ===== */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 space-y-8 overflow-x-hidden">

        {/* ================= HEADER ================= */}
        <Card className="bg-white/80 backdrop-blur border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
            <h2 className="text-xl font-semibold">Admin Panel</h2>

            <nav className="flex items-center gap-2">
              <Link to="/admin/athletes" className={navLink("/admin/athletes")}>
                Athletes
              </Link>
              <Link to="/admin/events" className={navLink("/admin/events")}>
                Events
              </Link>
              <Link to="/admin/results" className={navLink("/admin/results")}>
                Results
              </Link>
            </nav>
          </CardContent>
        </Card>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

          <Card className="bg-white/80 backdrop-blur border border-slate-200 shadow-sm transition hover:shadow-md hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-base">Manage Athletes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Add, edit, and manage registered athletes.
              </p>
              <Link to="/admin/athletes">
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 transition active:scale-95"
                >
                  Go to Athletes
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border border-slate-200 shadow-sm transition hover:shadow-md hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-base">Manage Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Create events, heats, and rounds.
              </p>
              <Link to="/admin/events">
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 transition active:scale-95"
                >
                  Go to Events
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border border-slate-200 shadow-sm transition hover:shadow-md hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-base">Enter Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Submit race results and update leaderboards.
              </p>
              <Link to="/admin/results">
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 transition active:scale-95"
                >
                  Go to Results
                </Button>
              </Link>
            </CardContent>
          </Card>

        </div>

        {/* ================= PAGE CONTENT ================= */}
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
          <Outlet />
        </div>

      </div>
    </div>
  );
}
