import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/events").then((r) => setEvents(r.data.data || r.data));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upcoming Events</h1>
        <p className="text-muted-foreground mt-1">
          Live and upcoming athletics competitions
        </p>
      </div>

      {/* EMPTY STATE */}
      {events.length === 0 && (
        <Card className="border-dashed border-slate-300">
          <CardContent className="py-10 text-center text-muted-foreground">
            No events available right now
          </CardContent>
        </Card>
      )}

      {/* EVENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((ev) => (
          <Card
            key={ev.id}
            className="
              border border-slate-200
              shadow-sm
              hover:shadow-md
              transition
            "
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {ev.eventName}

                    {/* LIVE indicator */}
                    {ev.status === "LIVE" && <LiveBadge />}
                  </CardTitle>

                  <p className="text-sm text-muted-foreground mt-1">
                    Athletics Track Event
                  </p>
                </div>

                <Badge variant="secondary">{ev.distance}m</Badge>
              </div>
            </CardHeader>

            <CardContent className="flex items-center justify-between">
              {/* Left info */}
              <div className="text-sm text-muted-foreground">
                View heats, results & leaderboard
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link to={`/event/${ev.id}`}>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </Link>

                <Link to={`/live/${ev.id}`}>
                  <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700"
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
  );
}
