import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* BRAND */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">
            RaceMaster 360
          </span>
        </Link>

        {/* NAV */}
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Home
          </Link>

          <Link
            to="/live/1"
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Live
          </Link>

          {/* AUTH SECTION */}
          {user && user.role === "admin" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback>
                      {user.email?.[0]?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">Admin</span>
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
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                Admin Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
