import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* LIVE BADGE */
function LiveBadge() {
  return (
    <span className="flex items-center gap-1.5 text-xs font-bold text-white bg-green-600 px-2.5 py-1 rounded-md shadow-sm">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-lg"></span>
      </span>
      LIVE
    </span>
  );
}

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/events").then((r) => setEvents(r.data.data || r.data));
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden track-field-bg">

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-12">

        {/* ================= HERO SLOGAN CARD ================= */}
        <Card className="relative overflow-hidden bg-slate-800 border border-slate-700 rounded-xl shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -ml-24 -mb-24"></div>
          <CardContent className="py-12 text-center space-y-4 relative z-10">
            <div className="flex justify-center mb-2">
              <div className="p-4 bg-slate-700/50 backdrop-blur rounded-xl border border-slate-600">
                <span className="text-5xl">🏆</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              🏃 Where Every <span className="text-green-400">Millisecond</span> Matters ⚡
            </h1>

            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              🎯 Track live races, instant rankings, and real-time leaderboards
              as athletics events unfold.
            </p>

            <div className="flex justify-center mt-4">
              <LiveBadge />
            </div>
          </CardContent>
        </Card>

        {/* ================= PAGE HEADER ================= */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-3xl">📅</span>
            Upcoming Events
          </h2>
          <p className="text-slate-400 mt-1">
            🏁 Live and upcoming athletics competitions
          </p>
        </div>

        {/* ================= EMPTY STATE ================= */}
        {events.length === 0 && (
          <Card className="border-dashed border-slate-600 bg-slate-800/50">
            <CardContent className="py-16 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-slate-700/50 rounded-full border border-slate-600">
                  <span className="text-4xl">📅</span>
                </div>
                <p className="text-white font-semibold text-lg">📭 No events available right now</p>
                <p className="text-sm text-slate-400">⏰ Check back later for upcoming competitions</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ================= EVENTS GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((ev) => (
            <Card
              key={ev.id}
              className="sports-card group"
            >
              <CardHeader className="pb-4 border-b border-slate-700 bg-slate-700/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-green-500/20 rounded-lg border border-green-500/30">
                      <span className="text-2xl">🏃</span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold flex items-center gap-2 text-white mb-1">
                        {ev.eventName}
                        {ev.status === "LIVE" && <LiveBadge />}
                      </CardTitle>

                      <p className="text-sm text-slate-400 flex items-center gap-2">
                        <span>🏃</span>
                        Athletics Track Event
                      </p>
                    </div>
                  </div>

                  <Badge className="bg-green-600 text-white font-semibold border-0 shadow-md px-3 py-1">
                    {ev.distance}m
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex items-center justify-between pt-6">
                <div className="text-sm text-slate-400 flex items-center gap-1">
                  <span>👁️</span>
                  View heats, results & leaderboard
                </div>

                <div className="flex gap-2">
                  <Link to={`/event/${ev.id}`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white font-medium"
                    >
                      <span className="mr-1">📋</span>
                      Details
                    </Button>
                  </Link>

                  <Link to={`/live/${ev.id}`}>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg font-semibold"
                    >
                      <span className="mr-1">🔴</span>
                      Live →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
