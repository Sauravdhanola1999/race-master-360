import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { initSocket } from "../../services/socket";

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
    const token = localStorage.getItem("token") || "";
    const socket = initSocket(token);

    socket.emit("joinLeaderboard", { eventId });

    const handleUpdate = (payload) => {
      console.log("🔄 Leaderboard Update:", payload);
      setBoard(payload);
    };

    socket.on("leaderboard:update", handleUpdate);

    return () => {
      socket.emit("leaveLeaderboard", { eventId });
      socket.off("leaderboard:update", handleUpdate);
    };
  }, [eventId]);

  const top3 = board.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Live Leaderboard</h1>
        <LiveBadge />
      </div>

      {/* PODIUM */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Podium</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 text-center gap-4">
            {/* Gold */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-3xl mb-1">🥇</div>
              <div className="font-semibold">
                {top3[0]?.Athlete?.name || "-"}
              </div>
              <div className="text-sm text-muted-foreground">
                {top3[0]?.finishTime?.toFixed(2) || "-"}
              </div>
            </div>

            {/* Silver */}
            <div className="bg-slate-100 rounded-lg p-4">
              <div className="text-3xl mb-1">🥈</div>
              <div className="font-semibold">
                {top3[1]?.Athlete?.name || "-"}
              </div>
              <div className="text-sm text-muted-foreground">
                {top3[1]?.finishTime?.toFixed(2) || "-"}
              </div>
            </div>

            {/* Bronze */}
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-3xl mb-1">🥉</div>
              <div className="font-semibold">
                {top3[2]?.Athlete?.name || "-"}
              </div>
              <div className="text-sm text-muted-foreground">
                {top3[2]?.finishTime?.toFixed(2) || "-"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FULL LEADERBOARD */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Full Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pos</TableHead>
                <TableHead>Athlete</TableHead>
                <TableHead>Finish Time</TableHead>
                <TableHead>Reaction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {board.map((r, i) => (
                <TableRow key={i} className={i % 2 === 0 ? "bg-slate-50" : ""}>
                  <TableCell className="font-medium">{r.position}</TableCell>
                  <TableCell>{r.Athlete?.name}</TableCell>
                  <TableCell>
                    {r.finishTime ? r.finishTime.toFixed(2) : "-"}
                  </TableCell>
                  <TableCell>
                    {r.reactionTime ? r.reactionTime.toFixed(3) : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
