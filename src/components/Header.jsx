import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils"; // shadcn helper

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/");
  }


  return (
    <header className="sticky top-0 z-50 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
        {/* ================= LEFT : BRAND ================= */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative">
            <img
              src="/racemaster.png"
              alt="RaceMaster 360"
              className="h-10 w-10 rounded-lg object-cover ring-2 ring-slate-600 group-hover:ring-green-500 transition-all"
            />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full ring-2 ring-slate-800"></div>
          </div>
          <span className="text-lg text-white font-bold tracking-tight">
            🏃 RaceMaster <span className="text-green-400">360</span>
          </span>
        </Link>

        {/* ================= CENTER : NAV LINKS ================= */}
        <nav className="flex-1 flex justify-center items-center gap-2">
          <Link 
            to="/" 
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all text-slate-300 flex items-center gap-1",
              location.pathname === "/" 
                ? "bg-green-600 text-white" 
                : "hover:bg-slate-700 hover:text-white"
            )}
          >
            <span>🏠</span>
            Home
          </Link>

          <Link 
            to="/live" 
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all text-slate-300 flex items-center gap-2",
              location.pathname.startsWith("/live") 
                ? "bg-green-600 text-white" 
                : "hover:bg-slate-700 hover:text-white"
            )}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Live
          </Link>
        </nav>

        {/* ================= RIGHT : ADMIN ================= */}
        <div className="flex justify-center">
          {user && user.role === "admin" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-md"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/image.png" alt="Admin" />
                    <AvatarFallback className="bg-blue-500 text-white text-xs font-medium">
                      {user.email?.[0]?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <span>⚙️</span>
                  Admin
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40 bg-slate-800 border border-slate-700 shadow-xl">
                <DropdownMenuItem 
                  onClick={() => navigate("/admin")}
                  className="text-slate-200 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                >
                  <span>📊</span>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-400 hover:bg-slate-700 flex items-center gap-2"
                >
                  <span>🚪</span>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white shadow-md font-semibold flex items-center gap-2"
              >
                <span>🔐</span>
                Admin Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
