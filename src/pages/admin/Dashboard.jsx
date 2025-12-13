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
import bgImage from "../../assets/crazypicture.jpg";

export default function Dashboard() {
  const [stats, setStats] = useState({
    events: 0,
    athletes: 0,
    heats: 0,
  });

  async function loadStats() {
    try {
      const [eventsRes, athletesRes] = await Promise.all([
        api.get("/events"),
        api.get("/athletes"),
      ]);

      let heatCount = 0;
      eventsRes.data.data?.forEach(ev => heatCount += ev.Heats?.length || 0);

      setStats({
        events: eventsRes.data.data?.length || 0,
        athletes: athletesRes.data.data?.length || 0,
        heats: heatCount,
      });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-6"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Optional overlay for readability */}
      <div className="bg-white/80 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-600 text-white rounded shadow">
            <div className="text-lg">Events</div>
            <div className="text-3xl font-bold">{stats.events}</div>
          </div>

          <div className="p-4 bg-green-600 text-white rounded shadow">
            <div className="text-lg">Athletes</div>
            <div className="text-3xl font-bold">{stats.athletes}</div>
          </div>

          <div className="p-4 bg-purple-600 text-white rounded shadow">
            <div className="text-lg">Heats</div>
            <div className="text-3xl font-bold">{stats.heats}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">Quick Actions</h3>
          <div className="flex gap-4 flex-wrap">
            <Link to="/admin/athletes" className="px-4 py-2 bg-blue-500 text-white rounded shadow">
              Manage Athletes
            </Link>

            <Link to="/admin/events" className="px-4 py-2 bg-green-500 text-white rounded shadow">
              Manage Events
            </Link>

            <Link to="/admin/heats" className="px-4 py-2 bg-purple-500 text-white rounded shadow">
              Manage Heats
            </Link>

            <Link to="/admin/results" className="px-4 py-2 bg-orange-500 text-white rounded shadow">
              Enter Results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
