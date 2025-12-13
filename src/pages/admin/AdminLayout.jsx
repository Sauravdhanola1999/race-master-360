import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function AdminLayout(){
  return (
    <div className="bg-white rounded shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Admin Panel</h2>
        <div>
          <Link to="/admin/athletes" className="mr-2 text-sm">Athletes</Link>
          <Link to="/admin/events" className="mr-2 text-sm">Events</Link>
          <Link to="/admin/results" className="text-sm">Results</Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
