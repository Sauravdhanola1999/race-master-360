// import React, { useEffect, useState } from "react";
// import api from "../../services/api";
// import { Link } from "react-router-dom";

// export default function Dashboard() {
//   const [stats, setStats] = useState({
//     events: 0,
//     athletes: 0,
//     heats: 0,
//   });

//   async function loadStats() {
//     try {
//       const [eventsRes, athletesRes] = await Promise.all([
//         api.get("/events"),
//         api.get("/athletes"),
//       ]);

//       let heatCount = 0;
//       eventsRes.data.data?.forEach(ev => heatCount += ev.Heats?.length || 0);

//       setStats({
//         events: eventsRes.data.data?.length || 0,
//         athletes: athletesRes.data.data?.length || 0,
//         heats: heatCount,
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   useEffect(() => {
//     loadStats();
//   }, []);

//   return (
//     <div>
//       <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-3 gap-4">
//         <div className="p-4 bg-blue-600 text-white rounded shadow">
//           <div className="text-lg">Events</div>
//           <div className="text-3xl font-bold">{stats.events}</div>
//         </div>

//         <div className="p-4 bg-green-600 text-white rounded shadow">
//           <div className="text-lg">Athletes</div>
//           <div className="text-3xl font-bold">{stats.athletes}</div>
//         </div>

//         <div className="p-4 bg-purple-600 text-white rounded shadow">
//           <div className="text-lg">Heats</div>
//           <div className="text-3xl font-bold">{stats.heats}</div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="mt-6">
//         <h3 className="text-xl font-semibold mb-3">Quick Actions</h3>
//         <div className="flex gap-4">
//           <Link
//             to="/admin/athletes"
//             className="px-4 py-2 bg-blue-500 text-white rounded shadow"
//           >
//             Manage Athletes
//           </Link>

//           <Link
//             to="/admin/events"
//             className="px-4 py-2 bg-green-500 text-white rounded shadow"
//           >
//             Manage Events
//           </Link>

//           <Link
//             to="/admin/heats"
//             className="px-4 py-2 bg-purple-500 text-white rounded shadow"
//           >
//             Manage Heats
//           </Link>

//           <Link
//             to="/admin/results"
//             className="px-4 py-2 bg-orange-500 text-white rounded shadow"
//           >
//             Enter Results
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }




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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-6 overflow-hidden">
  {/* Main container */}
  <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8">

    {/* Header */}
    {/* <h2 className="text-2xl font-bold mb-8 tracking-tight">
      Admin Dashboard
    </h2> */}

    {/* ================= STATS GRID ================= */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

      <div className="rounded-2xl bg-blue-500 text-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
        <div className="text-sm uppercase tracking-wide opacity-90">
          Events
        </div>
        <div className="text-4xl font-extrabold mt-1">
          {stats.events}
        </div>
      </div>

      <div className="rounded-2xl bg-green-500 text-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
        <div className="text-sm uppercase tracking-wide opacity-90">
          Athletes
        </div>
        <div className="text-4xl font-extrabold mt-1">
          {stats.athletes}
        </div>
      </div>

      <div className="rounded-2xl bg-purple-500 text-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
        <div className="text-sm uppercase tracking-wide opacity-90">
          Heats
        </div>
        <div className="text-4xl font-extrabold mt-1">
          {stats.heats}
        </div>
      </div>

    </div>

    {/* ================= QUICK ACTIONS ================= */}
    <div>
      <h3 className="text-xl font-semibold mb-4">
        Quick Actions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

        {/* Athletes */}
        <Link
          to="/admin/athletes"
          className="
            group
            rounded-2xl
            bg-blue-500
            text-white
            p-6
            text-center
            shadow-md
            transition-all duration-200
            hover:-translate-y-1 hover:shadow-xl
            active:scale-95
          "
        >
          <div className="text-3xl mb-2">🏃</div>
          <div className="font-semibold group-hover:scale-105 transition">
            Manage Athletes
          </div>
        </Link>

        {/* Events */}
        <Link
          to="/admin/events"
          className="
            group
            rounded-2xl
            bg-green-500
            text-white
            p-6
            text-center
            shadow-md
            transition-all duration-200
            hover:-translate-y-1 hover:shadow-xl
            active:scale-95
          "
        >
          <div className="text-3xl mb-2">📅</div>
          <div className="font-semibold group-hover:scale-105 transition">
            Manage Events
          </div>
        </Link>

        {/* Heats */}
        <Link
          to="/admin/heats"
          className="
            group
            rounded-2xl
            bg-purple-500
            text-white
            p-6
            text-center
            shadow-md
            transition-all duration-200
            hover:-translate-y-1 hover:shadow-xl
            active:scale-95
          "
        >
          <div className="text-3xl mb-2">🔥</div>
          <div className="font-semibold group-hover:scale-105 transition">
            Manage Heats
          </div>
        </Link>

        {/* Results */}
        <Link
          to="/admin/results"
          className="
            group
            rounded-2xl
            bg-orange-500
            text-white
            p-6
            text-center
            shadow-md
            transition-all duration-200
            hover:-translate-y-1 hover:shadow-xl
            active:scale-95
          "
        >
          <div className="text-3xl mb-2">🏁</div>
          <div className="font-semibold group-hover:scale-105 transition">
            Enter Results
          </div>
        </Link>

      </div>
    </div>

  </div>
</div>

  );
}
