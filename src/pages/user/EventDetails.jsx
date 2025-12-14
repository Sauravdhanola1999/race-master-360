import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [heats, setHeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [eventRes, heatsRes] = await Promise.all([
          api.get(`/events/${id}`),
          api.get(`/heats/event/${id}`)
        ]);
        
        setEvent(eventRes.data.data || eventRes.data);
        setHeats(heatsRes.data.data || heatsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch event data:", err);
        // Still try to set event if it exists
        try {
          const eventRes = await api.get(`/events/${id}`);
          setEvent(eventRes.data.data || eventRes.data);
        } catch (e) {
          console.error("Failed to fetch event:", e);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-slate-400">
        <div className="text-center">
          <span className="text-4xl mb-2 block">⏳</span>
          <p>Loading event details...</p>
        </div>
      </div>
    );

  if (!event)
    return (
      <div className="flex justify-center items-center min-h-screen text-slate-400">
        <div className="text-center">
          <span className="text-4xl mb-2 block">❌</span>
          <p>Event not found</p>
        </div>
      </div>
    );

  return (
    <div className="relative min-h-screen overflow-hidden track-field-bg">
      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 space-y-6 sm:space-y-8">
        {/* EVENT HEADER */}
        <Card className="sports-card">
          <CardHeader className="bg-slate-700/50 border-b border-slate-600 rounded-t-lg py-3 sm:py-4">
            <CardTitle className="text-xl sm:text-2xl font-bold text-white">
              {event.eventName}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 sm:gap-3 pt-4 sm:pt-6">
            <Badge className="bg-green-600 text-white font-semibold border-0 shadow-md px-2 sm:px-3 py-1 text-xs sm:text-sm">
              {event.distance}m
            </Badge>
            <Badge className="bg-blue-600 text-white font-semibold border-0 shadow-md px-2 sm:px-3 py-1 text-xs sm:text-sm">
              {event.category}
            </Badge>
          </CardContent>
        </Card>

        {/* HEATS */}
        <Card className="sports-card">
          <CardHeader className="bg-slate-700/50 border-b border-slate-600 rounded-t-lg py-3 sm:py-4">
            <CardTitle className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                <span className="text-xl sm:text-2xl">🔥</span>
              </div>
              Heats
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 pt-4 sm:pt-6">
            {heats.length > 0 ? (
              heats.map((h) => (
                <div
                  key={h.id}
                  className="
                    flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3
                    border border-slate-700 rounded-lg px-3 sm:px-4 py-3
                    bg-slate-800/50
                    hover:bg-slate-700/50 transition
                  "
                >
                  <div>
                    <div className="font-medium text-white text-sm sm:text-base">
                      🔥 Heat {h.heatNumber}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-400">
                      Round: {h.round}
                    </div>
                  </div>

                  <Link to={`/live?eventId=${id}`} className="w-full sm:w-auto">
                    <Button
                      size="sm"
                      className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md text-xs sm:text-sm"
                    >
                      <span className="mr-1">🔴</span>
                      View Live
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-slate-400 text-center py-8 sm:py-12">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl sm:text-4xl">🔥</span>
                  <p className="font-medium text-slate-300 text-sm sm:text-base">No heats created yet.</p>
                  <p className="text-xs sm:text-sm text-slate-500">Heats will appear here once they are created</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
