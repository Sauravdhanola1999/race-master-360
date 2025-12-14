
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { initSocket } from "../../services/socket";
// import api from "../../services/api";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// // 🔴 LIVE badge component
// function LiveBadge() {
//   return (
//     <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
//       <span className="relative flex h-2 w-2">
//         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
//         <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
//       </span>
//       LIVE
//     </span>
//   );
// }

// export default function LiveLeaderboard() {
//   const { eventId } = useParams();
//   const [board, setBoard] = useState([]);

//   useEffect(() => {
//     let socket;
//     async function init() {
//       try {
//         const res = await api.get(`/results/leaderboard/${eventId}`);
//         setBoard(res.data.data);
//       } catch (err) {
//         console.error("Failed to fetch leaderboard:", err);
//       }

//       const token = localStorage.getItem("token");
//       socket = initSocket(token);
//       socket.emit("joinLeaderboard", { eventId: String(eventId) });

//       socket.on("leaderboard:update", (payload) => {
//         setBoard(payload);
//       });
//     }

//     init();

//     return () => {
//       if (socket) {
//         socket.emit("leaveLeaderboard", { eventId: String(eventId) });
//         socket.off("leaderboard:update");
//       }
//     };
//   }, [eventId]);

//   const top3 = board.slice(0, 3);
//   const winner = top3[0];
//   const runnerUp = top3[1];

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">
//       {/* ===== BACKGROUND BLOBS ===== */}
//       <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
//       <div className="pointer-events-none absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl" />
//       <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />

//       <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-8">
//         {/* ===== LIVE MARQUEE ===== */}
//         <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 backdrop-blur px-4 py-2 shadow-sm">
//           <div className="flex items-center gap-3 text-sm">
//             {/* LEFT: LIVE LABEL */}
//             <div className="flex items-center gap-2 font-medium text-indigo-900 shrink-0">
//               <span className="animate-pulse">🔴</span>
//               Live Update
//             </div>

//             {/* CENTER: SCROLLING MARQUEE */}
//             <div className="flex-1 overflow-hidden whitespace-nowrap text-center">
//               <div className="inline-block animate-marquee text-slate-800 font-medium">
//                 🏆 Winner: {winner?.Athlete?.name || "—"}{" "}
//                 {winner?.finishTime && `(${winner.finishTime.toFixed(2)}s)`}{" "}
//                 &nbsp;&nbsp;|&nbsp;&nbsp; 🥈 Runner-up: {runnerUp?.Athlete?.name || "—"}{" "}
//                 {runnerUp?.finishTime && `(${runnerUp.finishTime.toFixed(2)}s)`}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ===== HERO CARD ===== */}
//         <Card className="border border-indigo-200 bg-white/70 backdrop-blur shadow-md">
//           <CardContent className="py-6">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               <div>
//                 <h1 className="text-2xl font-bold flex items-center gap-2">
//                   Live Leaderboard <LiveBadge />
//                 </h1>
//                 <p className="text-sm text-muted-foreground mt-1 max-w-xl">
//                   This leaderboard shows current race rankings based on official finish times. Results update automatically as officials enter data — no refresh required.
//                 </p>
//               </div>
//               <div className="text-sm text-indigo-700 font-medium">⚡ Updates in real time</div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* ===== PODIUM ===== */}
//         <Card className="border border-slate-200 bg-white/80 backdrop-blur shadow-sm">
//           <CardHeader>
//             <CardTitle>Podium (Top 3)</CardTitle>
//             <p className="text-sm text-muted-foreground">
//               Leading athletes based on fastest finish times
//             </p>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
//               {/* 2nd PLACE */}
//               <div className="order-2 md:order-1 bg-white/70 backdrop-blur rounded-2xl p-5 border border-slate-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
//                 <div className="text-2xl mb-2">🥈</div>
//                 <div className="text-sm uppercase tracking-wide text-slate-500">2nd Place</div>
//                 <div className="font-semibold mt-1">{top3[1]?.Athlete?.name || "—"}</div>
//                 <div className="text-sm text-muted-foreground font-mono mt-1">{top3[1]?.finishTime?.toFixed(2) || "—"} s</div>
//               </div>

//               {/* 1st PLACE (CENTER, HIGHLIGHT) */}
//               <div className="order-1 md:order-2 bg-gradient-to-b from-yellow-100 to-yellow-50 rounded-2xl p-6 border border-yellow-300 shadow-lg scale-105">
//                 <div className="text-3xl mb-2">🥇</div>
//                 <div className="text-sm uppercase tracking-wide text-yellow-700">Winner</div>
//                 <div className="font-bold text-lg mt-1">{top3[0]?.Athlete?.name || "—"}</div>
//                 <div className="text-sm font-mono text-yellow-800 mt-1">{top3[0]?.finishTime?.toFixed(2) || "—"} s</div>
//               </div>

//               {/* 3rd PLACE */}
//               <div className="order-3 bg-white/70 backdrop-blur rounded-2xl p-5 border border-slate-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
//                 <div className="text-2xl mb-2">🥉</div>
//                 <div className="text-sm uppercase tracking-wide text-slate-500">3rd Place</div>
//                 <div className="font-semibold mt-1">{top3[2]?.Athlete?.name || "—"}</div>
//                 <div className="text-sm text-muted-foreground font-mono mt-1">{top3[2]?.finishTime?.toFixed(2) || "—"} s</div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* ===== FULL LEADERBOARD TABLE ===== */}
//         <Card className="border border-slate-200 bg-white/80 backdrop-blur rounded-2xl shadow-sm">
//           <CardHeader className="pb-4">
//             <CardTitle className="text-lg">Full Results</CardTitle>
//             <p className="text-sm text-muted-foreground">Rankings sorted by fastest finish time</p>
//           </CardHeader>
//           <CardContent className="p-0">
//             <div className="relative overflow-hidden rounded-b-2xl">
//               <Table>
//                 <TableHeader className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b">
//                   <TableRow>
//                     <TableHead className="w-20 text-center">Pos</TableHead>
//                     <TableHead>Athlete</TableHead>
//                     <TableHead className="text-right">Finish (s)</TableHead>
//                     <TableHead className="text-right">Reaction (s)</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {board.map((r, i) => {
//                     const isTop3 = r.position <= 3;
//                     const medal =
//                       r.position === 1
//                         ? "🥇"
//                         : r.position === 2
//                         ? "🥈"
//                         : r.position === 3
//                         ? "🥉"
//                         : null;
//                     return (
//                       <TableRow
//                         key={i}
//                         className={`transition ${isTop3 ? "bg-indigo-50/40" : ""} hover:bg-indigo-50/70`}
//                       >
//                         <TableCell className="text-center font-semibold">
//                           <div className="flex items-center justify-center gap-1">
//                             {medal && <span className="text-lg">{medal}</span>}
//                             <span>{r.position}</span>
//                           </div>
//                         </TableCell>
//                         <TableCell className="font-medium">{r.Athlete?.name}</TableCell>
//                         <TableCell className="text-right font-mono">{r.finishTime ? r.finishTime.toFixed(2) : "—"}</TableCell>
//                         <TableCell className="text-right font-mono text-slate-600">{r.reactionTime ? r.reactionTime.toFixed(3) : "—"}</TableCell>
//                       </TableRow>
//                     );
//                   })}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }














// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Confetti from "react-confetti";

// import { initSocket } from "../../services/socket";
// import api from "../../services/api";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// // 🔴 LIVE badge component
// function LiveBadge() {
//   return (
//     <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
//       <span className="relative flex h-2 w-2">
//         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
//         <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
//       </span>
//       LIVE
//     </span>
//   );
// }

// export default function LiveLeaderboard() {
//   const { eventId } = useParams();
//   const [board, setBoard] = useState([]);

//   /* 🎆 Confetti screen size */
//   const [size, setSize] = useState({
//     width: window.innerWidth,
//     height: window.innerHeight,
//   });

//   useEffect(() => {
//     const onResize = () =>
//       setSize({ width: window.innerWidth, height: window.innerHeight });
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, []);

//   /* 🔄 API + SOCKET */
//   useEffect(() => {
//     let socket;
//     async function init() {
//       try {
//         const res = await api.get(`/results/leaderboard/${eventId}`);
//         setBoard(res.data.data);
//       } catch (err) {
//         console.error("Failed to fetch leaderboard:", err);
//       }

//       const token = localStorage.getItem("token");
//       socket = initSocket(token);
//       socket.emit("joinLeaderboard", { eventId: String(eventId) });

//       socket.on("leaderboard:update", (payload) => {
//         setBoard(payload);
//       });
//     }

//     init();

//     return () => {
//       if (socket) {
//         socket.emit("leaveLeaderboard", { eventId: String(eventId) });
//         socket.off("leaderboard:update");
//       }
//     };
//   }, [eventId]);

//   const top3 = board.slice(0, 3);
//   const winner = top3[0];
//   const runnerUp = top3[1];

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">

//       {/* 🎆 NON-STOP CRACKERS / CELEBRATION EFFECT */}
//       <Confetti
//         width={size.width}
//         height={size.height}
//         recycle={true}
//         numberOfPieces={200}
//         gravity={0.15}
//         wind={0.02}
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           zIndex: 40,
//           pointerEvents: "none",
//         }}
//       />

//       {/* ===== BACKGROUND BLOBS ===== */}
//       <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
//       <div className="pointer-events-none absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl" />
//       <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />

//       <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-8">
//         {/* ===== LIVE MARQUEE ===== */}
//         <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 backdrop-blur px-4 py-2 shadow-sm">
//           <div className="flex items-center gap-3 text-sm">
//             <div className="flex items-center gap-2 font-medium text-indigo-900 shrink-0">
//               <span className="animate-pulse">🔴</span>
//               Live Update
//             </div>

//             <div className="flex-1 overflow-hidden whitespace-nowrap text-center">
//               <div className="inline-block animate-marquee text-slate-800 font-medium">
//                 🏆 Winner: {winner?.Athlete?.name || "—"}{" "}
//                 {winner?.finishTime && `(${winner.finishTime.toFixed(2)}s)`}{" "}
//                 &nbsp;&nbsp;|&nbsp;&nbsp; 🥈 Runner-up: {runnerUp?.Athlete?.name || "—"}{" "}
//                 {runnerUp?.finishTime && `(${runnerUp.finishTime.toFixed(2)}s)`}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ===== HERO CARD ===== */}
//         <Card className="border border-indigo-200 bg-white/70 backdrop-blur shadow-md">
//           <CardContent className="py-6">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               <div>
//                 <h1 className="text-2xl font-bold flex items-center gap-2">
//                   Live Leaderboard <LiveBadge />
//                 </h1>
//                 <p className="text-sm text-muted-foreground mt-1 max-w-xl">
//                   This leaderboard shows current race rankings based on official finish times. Results update automatically as officials enter data — no refresh required.
//                 </p>
//               </div>
//               <div className="text-sm text-indigo-700 font-medium">
//                 ⚡ Updates in real time
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* ===== PODIUM (UNCHANGED ✅) ===== */}
//         <Card className="border border-slate-200 bg-white/80 backdrop-blur shadow-sm">
//           <CardHeader>
//             <CardTitle>Podium (Top 3)</CardTitle>
//             <p className="text-sm text-muted-foreground">
//               Leading athletes based on fastest finish times
//             </p>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
//               {/* 2nd */}
//               <div className="order-2 md:order-1 bg-white/70 backdrop-blur rounded-2xl p-5 border border-slate-200 shadow-sm">
//                 <div className="text-2xl mb-2">🥈</div>
//                 <div className="font-semibold">{top3[1]?.Athlete?.name || "—"}</div>
//               </div>

//               {/* 1st */}
//               <div className="order-1 md:order-2 bg-gradient-to-b from-yellow-100 to-yellow-50 rounded-2xl p-6 border border-yellow-300 shadow-lg scale-105">
//                 <div className="text-3xl mb-2">🥇</div>
//                 <div className="font-bold">{top3[0]?.Athlete?.name || "—"}</div>
//               </div>

//               {/* 3rd */}
//               <div className="order-3 bg-white/70 backdrop-blur rounded-2xl p-5 border border-slate-200 shadow-sm">
//                 <div className="text-2xl mb-2">🥉</div>
//                 <div className="font-semibold">{top3[2]?.Athlete?.name || "—"}</div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* ===== TABLE ===== */}
//         <Card className="border border-slate-200 bg-white/80 backdrop-blur rounded-2xl shadow-sm">
//           <CardHeader className="pb-4">
//             <CardTitle className="text-lg">Full Results</CardTitle>
//           </CardHeader>
//           <CardContent className="p-0">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="text-center">Pos</TableHead>
//                   <TableHead>Athlete</TableHead>
//                   <TableHead className="text-right">Finish (s)</TableHead>
//                   <TableHead className="text-right">Reaction (s)</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {board.map((r, i) => (
//                   <TableRow key={i}>
//                     <TableCell className="text-center">{r.position}</TableCell>
//                     <TableCell>{r.Athlete?.name}</TableCell>
//                     <TableCell className="text-right">{r.finishTime?.toFixed(2) || "—"}</TableCell>
//                     <TableCell className="text-right">{r.reactionTime?.toFixed(3) || "—"}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }




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
    <div className="relative min-h-screen overflow-hidden track-field-bg">

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

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-8">

        {/* ===== LIVE MARQUEE ===== */}
        <div className="rounded-lg border border-green-500/30 bg-slate-800/80 backdrop-blur px-4 py-3 shadow-lg">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 font-semibold text-green-400 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Live Update
            </div>

            <div className="flex-1 overflow-hidden whitespace-nowrap text-center">
              <div className="inline-block animate-marquee text-white font-medium">
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
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span>🏅</span>
              Podium (Top 3)
            </CardTitle>
            <p className="text-sm text-slate-400">
              ⚡ Leading athletes based on fastest finish times
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="order-2 md:order-1 bg-slate-700/50 rounded-xl p-5 border border-slate-600 shadow-md">
                <div className="text-2xl mb-2">🥈</div>
                <div className="font-semibold mt-1 text-white">
                  {top3[1]?.Athlete?.name || "—"}
                </div>
              </div>

              <div className="order-1 md:order-2 bg-gradient-to-b from-yellow-500/20 to-yellow-600/10 rounded-xl p-6 border border-yellow-500/30 shadow-lg scale-105">
                <div className="text-3xl mb-2">🥇</div>
                <div className="font-bold text-lg mt-1 text-white">
                  {top3[0]?.Athlete?.name || "—"}
                </div>
              </div>

              <div className="order-3 bg-slate-700/50 rounded-xl p-5 border border-slate-600 shadow-md">
                <div className="text-2xl mb-2">🥉</div>
                <div className="font-semibold mt-1 text-white">
                  {top3[2]?.Athlete?.name || "—"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===== FULL RESULTS ===== */}
        <Card className="border border-slate-700 bg-slate-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span>📋</span>
              Full Results
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-700/50 border-b border-slate-600">
                  <TableHead className="text-slate-300">🏆 Pos</TableHead>
                  <TableHead className="text-slate-300">👤 Athlete</TableHead>
                  <TableHead className="text-right text-slate-300">⏱️ Finish</TableHead>
                  <TableHead className="text-right text-slate-300">⚡ Reaction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {board.map((r, i) => (
                  <TableRow key={i} className={`border-b border-slate-700 ${i % 2 === 0 ? "bg-slate-800/50" : "bg-slate-800/30"} hover:bg-slate-700/50`}>
                    <TableCell className="text-slate-300">{r.position}</TableCell>
                    <TableCell className="text-white font-medium">{r.Athlete?.name}</TableCell>
                    <TableCell className="text-right text-slate-300 font-mono">
                      {r.finishTime?.toFixed(2) || "—"}
                    </TableCell>
                    <TableCell className="text-right text-slate-300 font-mono">
                      {r.reactionTime?.toFixed(3) || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
