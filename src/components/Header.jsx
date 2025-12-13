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

  const navBtn = (path) =>
    cn(
      "px-3 py-1.5 rounded-md text-sm font-medium transition text-white",
      location.pathname === path ? "bg-indigo-600" : "hover:bg-white/10"
    );

  return (
    // <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
    <header className="sticky top-0 z-50 bg-black border-b border-white/20">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
        {/* ================= LEFT : BRAND ================= */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/racemaster.png"
            alt="RaceMaster 360"
            className="h-9 w-9 rounded-xl object-cover"
          />
          <span className="text-lg text-white font-bold tracking-tight">
            RaceMaster 360
          </span>
        </Link>

        {/* ================= CENTER : NAV LINKS ================= */}
        <nav className="flex-1 flex justify-center items-center gap-6">
          <Link to="/" className={navBtn("/")}>
            Home
          </Link>

          <Link to="/live/1" className={navBtn("/live/1")}>
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
                  className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center"
                >
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src="/image.png" alt="Admin" />
                    <AvatarFallback>
                      {user.email?.[0]?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  Admin
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => navigate("/admin")}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Admin Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
