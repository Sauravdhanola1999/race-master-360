import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({
    events: 0,
    athletes: 0,
    heats: 0,
  });

 async function loadStats() {
  try {
    const [eventsRes, athletesRes, heatsRes] = await Promise.all([
      api.get("/events"),
      api.get("/athletes"),
      api.get("/heats"),
    ]);

    setStats({
      events: eventsRes.data.data?.length || 0,
      athletes: athletesRes.data.data?.length || 0,
      heats: heatsRes.data.data?.length || 0, // ✅ FIX
    });
  } catch (err) {
    console.error(err);
  }
}


  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="min-h-screen track-field-bg p-3 sm:p-4 md:p-6 overflow-hidden">
  {/* Main container */}
  <div className="max-w-6xl mx-auto bg-slate-800 rounded-xl shadow-xl p-4 sm:p-6 md:p-8 border border-slate-700">

    {/* ================= STATS GRID ================= */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">

      <div className="stats-card cursor-pointer border-blue-500/30">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <div className="text-xs uppercase tracking-widest text-blue-400 font-semibold flex items-center gap-2 mb-1">
              Events
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 sm:mt-3 text-white tracking-tight">
              {stats.events}
            </div>
            <div className="text-xs text-slate-400 mt-1 sm:mt-2">Total registered</div>
          </div>
          <div className="p-2 sm:p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <span className="text-2xl sm:text-3xl md:text-4xl">📅</span>
          </div>
        </div>
      </div>

      <div className="stats-card cursor-pointer border-green-500/30">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <div className="text-xs uppercase tracking-widest text-green-400 font-semibold flex items-center gap-2 mb-1">
              Athletes
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 sm:mt-3 text-white tracking-tight">
              {stats.athletes}
            </div>
            <div className="text-xs text-slate-400 mt-1 sm:mt-2">Active participants</div>
          </div>
          <div className="p-2 sm:p-3 bg-green-500/10 rounded-xl border border-green-500/20">
            <span className="text-2xl sm:text-3xl md:text-4xl">👥</span>
          </div>
        </div>
      </div>

      <div className="stats-card cursor-pointer border-sky-500/30 sm:col-span-2 lg:col-span-1">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <div className="text-xs uppercase tracking-widest text-sky-400 font-semibold flex items-center gap-2 mb-1">
              Heats
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 sm:mt-3 text-white tracking-tight">
              {stats.heats}
            </div>
            <div className="text-xs text-slate-400 mt-1 sm:mt-2">Race sessions</div>
          </div>
          <div className="p-2 sm:p-3 bg-sky-500/10 rounded-xl border border-sky-500/20">
            <span className="text-2xl sm:text-3xl md:text-4xl">🔥</span>
          </div>
        </div>
      </div>

    </div>

    {/* ================= QUICK ACTIONS ================= */}
    <div>
      <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white flex items-center gap-2">
        <span className="text-xl sm:text-2xl">⚡</span>
        Quick Actions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

        {/* Athletes */}
        <Link
          to="/admin/athletes"
          className="
            group
            rounded-lg
            bg-slate-700/50
            text-white
            p-4 sm:p-5 md:p-6
            text-center
            border border-slate-600
            shadow-md
            transition-all duration-300
            hover:bg-slate-700 hover:border-green-500/50 hover:shadow-lg hover:-translate-y-1
            active:scale-95
          "
        >
          <div className="p-2 sm:p-3 bg-green-500/20 rounded-lg w-fit mx-auto mb-2 sm:mb-3 border border-green-500/30 group-hover:bg-green-500/30 transition-colors">
            <span className="text-2xl sm:text-3xl">👥</span>
          </div>
          <div className="font-semibold text-xs sm:text-sm">
            Manage Athletes
          </div>
        </Link>

        {/* Events */}
        <Link
          to="/admin/events"
          className="
            group
            rounded-lg
            bg-slate-700/50
            text-white
            p-4 sm:p-5 md:p-6
            text-center
            border border-slate-600
            shadow-md
            transition-all duration-300
            hover:bg-slate-700 hover:border-blue-500/50 hover:shadow-lg hover:-translate-y-1
            active:scale-95
          "
        >
          <div className="p-2 sm:p-3 bg-blue-500/20 rounded-lg w-fit mx-auto mb-2 sm:mb-3 border border-blue-500/30 group-hover:bg-blue-500/30 transition-colors">
            <span className="text-2xl sm:text-3xl">📅</span>
          </div>
          <div className="font-semibold text-xs sm:text-sm">
            Manage Events
          </div>
        </Link>

        {/* Heats */}
        <Link
          to="/admin/heats"
          className="
            group
            rounded-lg
            bg-slate-700/50
            text-white
            p-4 sm:p-5 md:p-6
            text-center
            border border-slate-600
            shadow-md
            transition-all duration-300
            hover:bg-slate-700 hover:border-sky-500/50 hover:shadow-lg hover:-translate-y-1
            active:scale-95
          "
        >
          <div className="p-2 sm:p-3 bg-sky-500/20 rounded-lg w-fit mx-auto mb-2 sm:mb-3 border border-sky-500/30 group-hover:bg-sky-500/30 transition-colors">
            <span className="text-2xl sm:text-3xl">🔥</span>
          </div>
          <div className="font-semibold text-xs sm:text-sm">
            Manage Heats
          </div>
        </Link>

        {/* Results */}
        <Link
          to="/admin/results"
          className="
            group
            rounded-lg
            bg-slate-700/50
            text-white
            p-4 sm:p-5 md:p-6
            text-center
            border border-slate-600
            shadow-md
            transition-all duration-300
            hover:bg-slate-700 hover:border-green-500/50 hover:shadow-lg hover:-translate-y-1
            active:scale-95
          "
        >
          <div className="p-2 sm:p-3 bg-green-500/20 rounded-lg w-fit mx-auto mb-2 sm:mb-3 border border-green-500/30 group-hover:bg-green-500/30 transition-colors">
            <span className="text-2xl sm:text-3xl">🏆</span>
          </div>
          <div className="font-semibold text-xs sm:text-sm">
            Enter Results
          </div>
        </Link>

      </div>
    </div>

  </div>
</div>

  );
}
