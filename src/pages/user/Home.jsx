import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* LIVE BADGE */
function LiveBadge() {
  return (
    <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">

      {/* ===== BACKGROUND DECORATIVE BLOBS (Same as Leaderboard) ===== */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-12">

        {/* ================= HERO SLOGAN CARD ================= */}
        <Card
          className="
            relative overflow-hidden
            bg-gradient-to-br from-indigo-600 to-indigo-700
            text-white
            rounded-2xl
            shadow-xl
          "
        >
          <CardContent className="py-16 text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Where Every Millisecond Matters
            </h1>

            <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
              Track live races, instant rankings, and real-time leaderboards
              as athletics events unfold.
            </p>

            <div className="flex justify-center mt-4">
              <LiveBadge />
            </div>
          </CardContent>

          {/* Decorative glow inside hero */}
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-black/10 blur-3xl" />
        </Card>

        {/* ================= PAGE HEADER ================= */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Upcoming Events
          </h2>
          <p className="text-muted-foreground mt-1">
            Live and upcoming athletics competitions
          </p>
        </div>

        {/* ================= EMPTY STATE ================= */}
        {events.length === 0 && (
          <Card className="border-dashed border-slate-300 bg-white/70 backdrop-blur">
            <CardContent className="py-12 text-center text-muted-foreground">
              No events available right now
            </CardContent>
          </Card>
        )}

        {/* ================= EVENTS GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((ev) => (
            <Card
              key={ev.id}
              className="
                bg-white/80
                backdrop-blur
                rounded-xl
                border border-slate-200
                shadow-sm
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {ev.eventName}
                      {ev.status === "LIVE" && <LiveBadge />}
                    </CardTitle>

                    <p className="text-sm text-muted-foreground mt-1">
                      Athletics Track Event
                    </p>
                  </div>

                  <Badge className="bg-indigo-50 text-indigo-700">
                    {ev.distance}m
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  View heats, results & leaderboard
                </div>

                <div className="flex gap-2">
                  <Link to={`/event/${ev.id}`}>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </Link>

                  <Link to={`/live/${ev.id}`}>
                    <Button
                      size="sm"
                      className="
                        bg-indigo-600
                        hover:bg-indigo-700
                        shadow-md
                        hover:shadow-lg
                      "
                    >
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
