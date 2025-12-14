import { Routes, Route } from "react-router-dom";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Athletes from "./pages/admin/Athletes";
import Events from "./pages/admin/Events";
import Heats from "./pages/admin/Heats";
import ResultEntry from "./pages/admin/ResultEntry";
import Home from "./pages/user/Home";
import EventDetails from "./pages/user/EventDetails";
import LiveLeaderboard from "./pages/user/LiveLeaderboard";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./auth/PrivateRoute";
import Header from "./components/Header";
import Login from "./pages/Login";

export default function App(){
  return (
    <div className="min-h-screen">
      {/* Simple Background Animations */}
      <div className="animated-track-lines"></div>
      
      <Header />
      <div className="pt-14 sm:pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/live" element={<LiveLeaderboard />} />

           <Route path="/login" element={<Login />} /> 

          <Route path="/admin" element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="athletes" element={<Athletes />} />
            <Route path="events" element={<Events />} />
            <Route path="heats" element={<Heats />} />
            <Route path="results" element={<ResultEntry />} />
          </Route>

          {/* 404 - Catch all unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
