import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

// 🔴 LIVE badge
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

export default function LiveLeaderboard() {
  const { eventId } = useParams();
  const [board, setBoard] = useState([]);

  useEffect(() => {
    let socket;

    async function init() {
      try {
        const res = await api.get(`/results/leaderboard/${eventId}`);
        setBoard(res.data.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      }

      const token = localStorage.getItem("token");
      socket = initSocket(token);

      socket.emit("joinLeaderboard", { eventId: String(eventId) });

      socket.on("leaderboard:update", (payload) => {
        setBoard(payload);
      });
    }

    init();

    return () => {
      if (socket) {
        socket.emit("leaveLeaderboard", { eventId: String(eventId) });
        socket.off("leaderboard:update");
      }
    };
  }, [eventId]);

  const top3 = board.slice(0, 3);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* ===== BACKGROUND DECORATIVE BLOBS ===== */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />

      {/* ===== CONTENT CONTAINER ===== */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-8">
        {/* ================= LIVE INFO / HERO CARD ================= */}
        <Card className="border border-indigo-200 bg-white/70 backdrop-blur shadow-md">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  Live Leaderboard
                  <LiveBadge />
                </h1>
                <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                  This leaderboard shows current race rankings based on official
                  finish times. Results update automatically as officials enter
                  data — no refresh required.
                </p>
              </div>

              <div className="text-sm text-indigo-700 font-medium">
                ⚡ Updates in real time
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ================= PODIUM ================= */}
        <Card className="border border-slate-200 bg-white/80 backdrop-blur shadow-sm">
          <CardHeader>
            <CardTitle>Podium (Top 3)</CardTitle>
            <p className="text-sm text-muted-foreground">
              Leading athletes based on fastest finish times
            </p>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-3 text-center gap-4">
              {/* Gold */}
              <div className="bg-yellow-50 rounded-lg p-4 shadow-inner">
                <div className="text-3xl mb-1">🥇</div>
                <div className="font-semibold">
                  {top3[0]?.Athlete?.name || "-"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {top3[0]?.finishTime?.toFixed(2) || "-"} sec
                </div>
              </div>

              {/* Silver */}
              <div className="bg-slate-100 rounded-lg p-4 shadow-inner">
                <div className="text-3xl mb-1">🥈</div>
                <div className="font-semibold">
                  {top3[1]?.Athlete?.name || "-"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {top3[1]?.finishTime?.toFixed(2) || "-"} sec
                </div>
              </div>

              {/* Bronze */}
              <div className="bg-orange-50 rounded-lg p-4 shadow-inner">
                <div className="text-3xl mb-1">🥉</div>
                <div className="font-semibold">
                  {top3[2]?.Athlete?.name || "-"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {top3[2]?.finishTime?.toFixed(2) || "-"} sec
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ================= FULL LEADERBOARD ================= */}
        <Card className="border border-slate-200 bg-white/80 backdrop-blur shadow-sm">
          <CardHeader>
            <CardTitle>Full Results</CardTitle>
            <p className="text-sm text-muted-foreground">
              Complete rankings sorted by finish time (fastest first)
            </p>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                {/* STICKY HEADER */}
                <TableHeader className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
                  <TableRow>
                    <TableHead className="w-24">Pos</TableHead>
                    <TableHead>Athlete</TableHead>
                    <TableHead className="text-right">Finish (s)</TableHead>
                    <TableHead className="text-right">Reaction (s)</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {board.map((r, i) => {
                    const medal =
                      r.position === 1
                        ? "🥇"
                        : r.position === 2
                          ? "🥈"
                          : r.position === 3
                            ? "🥉"
                            : null;

                    return (
                      <React.Fragment key={i}>
                        <TableRow className="transition hover:bg-indigo-50/60">
                          {/* POSITION */}
                          <TableCell className="font-semibold">
                            <div className="flex items-center gap-2">
                              {medal && (
                                <span className="text-lg">{medal}</span>
                              )}
                              <span>{r.position}</span>
                            </div>
                          </TableCell>

                          {/* ATHLETE */}
                          <TableCell className="font-medium">
                            {r.Athlete?.name}
                          </TableCell>

                          {/* FINISH TIME */}
                          <TableCell className="text-right font-mono">
                            {r.finishTime ? r.finishTime.toFixed(2) : "—"}
                          </TableCell>

                          {/* REACTION TIME */}
                          <TableCell className="text-right font-mono text-slate-600">
                            {r.reactionTime ? r.reactionTime.toFixed(3) : "—"}
                          </TableCell>
                        </TableRow>

                        {/* 👇 DIVIDER AFTER TOP 3 */}
                        {r.position === 3 && (
                          <TableRow>
                            <TableCell colSpan={4} className="py-2">
                              <div className="h-px bg-slate-200 my-2" />
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
