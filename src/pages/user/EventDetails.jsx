import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    api.get(`/events/${id}`).then((r) =>
      setEvent(r.data.data || r.data)
    );
  }, [id]);

  if (!event)
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
        Loading event details...
      </div>
    );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* EVENT HEADER */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            {event.eventName}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Badge variant="secondary">
            {event.distance}m
          </Badge>
          <Badge variant="outline">
            {event.category}
          </Badge>
        </CardContent>
      </Card>

      {/* HEATS */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Heats</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {event.Heats?.length > 0 ? (
            event.Heats.map((h) => (
              <div
                key={h.id}
                className="
                  flex items-center justify-between
                  border rounded-lg px-4 py-3
                  hover:bg-slate-50 transition
                "
              >
                <div>
                  <div className="font-medium">
                    Heat {h.heatNumber}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Round: {h.round}
                  </div>
                </div>

                <Link to={`/live/${event.id}`}>
                  <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    View Live
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground">
              No heats created yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
