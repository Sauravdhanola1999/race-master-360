import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Confetti from "react-confetti"; // ✅ ONLY NEW IMPORT

import { initSocket } from "../../services/socket";
import api from "../../services/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// 🔴 LIVE badge component
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

export default function LiveLeaderboard() {
  const [searchParams] = useSearchParams();
  const eventIdFromUrl = searchParams.get("eventId");
  
  const [board, setBoard] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);

  // ✅ CONFETTI SCREEN SIZE
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hide confetti after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Load event - either from URL parameter or find latest
  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        
        // If eventId is provided in URL, use that event
        if (eventIdFromUrl) {
          try {
            const eventRes = await api.get(`/events/${eventIdFromUrl}`);
            const event = eventRes.data.data || eventRes.data;
            
            if (event) {
              setCurrentEvent(event);
              // Fetch leaderboard for this event
              const leaderboardRes = await api.get(`/results/leaderboard/${event.id}`);
              setBoard(leaderboardRes.data.data || []);
            }
          } catch (err) {
            console.error("Failed to fetch event:", err);
          }
          setLoading(false);
          return;
        }

        // Otherwise, find the latest ongoing event
        const eventsRes = await api.get("/events");
        const events = eventsRes.data.data || eventsRes.data;

        if (!events || events.length === 0) {
          setLoading(false);
          return;
        }

        // Find event with the most recent results
        let latestEvent = null;
        let latestResultTime = null;

        for (const event of events) {
          try {
            const leaderboardRes = await api.get(`/results/leaderboard/${event.id}`);
            const results = leaderboardRes.data.data || [];

            if (results.length > 0) {
              // Find the most recent finish time in this event
              const recentResult = results
                .filter(r => r.finishTime)
                .sort((a, b) => {
                  // Sort by updatedAt if available, otherwise by finishTime
                  const timeA = new Date(a.updatedAt || 0).getTime();
                  const timeB = new Date(b.updatedAt || 0).getTime();
                  return timeB - timeA;
                })[0];

              if (recentResult) {
                const resultTime = new Date(recentResult.updatedAt || 0).getTime();
                if (!latestResultTime || resultTime > latestResultTime) {
                  latestResultTime = resultTime;
                  latestEvent = event;
                }
              }
            }
          } catch (err) {
            // Event has no results, skip it
            continue;
          }
        }

        // If no event with results found, use the most recently created/updated event
        if (!latestEvent && events.length > 0) {
          latestEvent = events.sort((a, b) => {
            const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
            const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
            return timeB - timeA;
          })[0];
        }

        if (latestEvent) {
          setCurrentEvent(latestEvent);
          // Fetch leaderboard for the latest event
          const leaderboardRes = await api.get(`/results/leaderboard/${latestEvent.id}`);
          setBoard(leaderboardRes.data.data || []);
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to load event:", err);
        setLoading(false);
      }
    }

    loadEvent();
  }, [eventIdFromUrl]);

  // Set up socket connection for the current event
  useEffect(() => {
    if (!currentEvent) return;

    let socket;
    async function init() {
      const token = localStorage.getItem("token");
      socket = initSocket(token);
      socket.emit("joinLeaderboard", { eventId: String(currentEvent.id) });

      socket.on("leaderboard:update", (payload) => {
        setBoard(payload);
      });
    }

    init();

    return () => {
      if (socket) {
        socket.emit("leaveLeaderboard", { eventId: String(currentEvent.id) });
        socket.off("leaderboard:update");
      }
    };
  }, [currentEvent]);

  const top3 = board.slice(0, 3);
  const winner = top3[0];
  const runnerUp = top3[1];

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden track-field-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🏃</div>
          <p className="text-xl text-white font-semibold">Loading latest live event...</p>
        </div>
      </div>
    );
  }

  if (!currentEvent || board.length === 0) {
    return (
      <div className="relative min-h-screen overflow-hidden track-field-bg">
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
          <Card className="border border-slate-700 bg-slate-800 shadow-lg">
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">📺</div>
              <h2 className="text-2xl font-bold text-white mb-2">No Live Event</h2>
              <p className="text-slate-400">
                There are currently no ongoing events with live results.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen  track-field-bg">

      {/* 🎆 CONFETTI (3 seconds only) */}
      {showConfetti && (
        <Confetti
          width={size.width}
          height={size.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 30,
            pointerEvents: "none",
          }}
        />
      )}

      {/* ===== BACKGROUND BLOBS ===== */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 md:px-6 pt-2 sm:pt-4 md:pt-6 pb-4 sm:pb-6 md:pb-8 space-y-3 sm:space-y-4 md:space-y-6">

        {/* ===== LIVE MARQUEE ===== */}
        <div className="rounded-lg border border-green-500/30 bg-slate-800/80 backdrop-blur px-3 sm:px-4 py-2 sm:py-3 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-semibold text-green-400 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Live Update
            </div>

            <div className="flex-1 overflow-hidden whitespace-nowrap text-center w-full sm:w-auto">
              <div className="inline-block animate-marquee text-white font-medium text-xs sm:text-sm">
                🏆 Winner: {winner?.Athlete?.name || "—"}{" "}
                {winner?.finishTime && `(${winner.finishTime.toFixed(2)}s)`} |
                🥈 Runner-up: {runnerUp?.Athlete?.name || "—"}{" "}
                {runnerUp?.finishTime && `(${runnerUp.finishTime.toFixed(2)}s)`}
              </div>
            </div>
          </div>
        </div>

        {/* ===== HERO CARD ===== */}
        <Card className="border border-slate-700 bg-slate-800 shadow-lg">
          <CardContent className="py-4 sm:py-5 md:py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
                  <span>🏆</span>
                  Live Leaderboard <LiveBadge />
                </h1>
                <p className="text-sm text-slate-400 mt-1 max-w-xl">
                  📊 <span className="font-semibold text-white">{currentEvent.eventName}</span> - {currentEvent.category} ({currentEvent.distance}m)
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Results update automatically as officials enter data — no refresh required.
                </p>
              </div>
              <div className="text-sm text-green-400 font-medium">
                ⚡ Updates in real time
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===== PODIUM ===== */}
        <Card className="border border-slate-700 bg-slate-800 shadow-lg">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl">
              <span>🏅</span>
              Podium (Top 3)
            </CardTitle>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              ⚡ Leading athletes based on fastest finish times
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 text-center">
              <div className="order-2 md:order-1 bg-slate-700/50 rounded-xl p-4 sm:p-5 border border-slate-600 shadow-md">
                <div className="text-xl sm:text-2xl mb-2">🥈</div>
                <div className="font-semibold mt-1 text-white text-sm sm:text-base">
                  {top3[1]?.Athlete?.name || "—"}
                </div>
              </div>

              <div className="order-1 md:order-2 bg-gradient-to-b from-yellow-500/20 to-yellow-600/10 rounded-xl p-5 sm:p-6 border border-yellow-500/30 shadow-lg scale-105">
                <div className="text-2xl sm:text-3xl mb-2">🥇</div>
                <div className="font-bold text-base sm:text-lg mt-1 text-white">
                  {top3[0]?.Athlete?.name || "—"}
                </div>
              </div>

              <div className="order-3 bg-slate-700/50 rounded-xl p-4 sm:p-5 border border-slate-600 shadow-md">
                <div className="text-xl sm:text-2xl mb-2">🥉</div>
                <div className="font-semibold mt-1 text-white text-sm sm:text-base">
                  {top3[2]?.Athlete?.name || "—"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===== FULL RESULTS ===== */}
        <Card className="border border-slate-700 bg-slate-800 shadow-lg">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl">
              <span>📋</span>
              Full Results
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-700/50 border-b border-slate-600">
                        <TableHead className="text-slate-300 text-xs sm:text-sm whitespace-nowrap">🏆 Pos</TableHead>
                        <TableHead className="text-slate-300 text-xs sm:text-sm whitespace-nowrap">👤 Athlete</TableHead>
                        <TableHead className="text-right text-slate-300 text-xs sm:text-sm whitespace-nowrap">⏱️ Finish</TableHead>
                        <TableHead className="text-right text-slate-300 text-xs sm:text-sm whitespace-nowrap">⚡ Reaction</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {board.map((r, i) => (
                        <TableRow key={i} className={`border-b border-slate-700 ${i % 2 === 0 ? "bg-slate-800/50" : "bg-slate-800/30"} hover:bg-slate-700/50`}>
                          <TableCell className="text-slate-300 text-xs sm:text-sm">{r.position}</TableCell>
                          <TableCell className="text-white font-medium text-xs sm:text-sm whitespace-nowrap">{r.Athlete?.name}</TableCell>
                          <TableCell className="text-right text-slate-300 font-mono text-xs sm:text-sm whitespace-nowrap">
                            {r.finishTime?.toFixed(2) || "—"}
                          </TableCell>
                          <TableCell className="text-right text-slate-300 font-mono text-xs sm:text-sm whitespace-nowrap">
                            {r.reactionTime?.toFixed(3) || "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
