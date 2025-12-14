import React, { useContext, useState } from "react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* ================= LEFT : BRAND ================= */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group" onClick={() => setMobileMenuOpen(false)}>
          <div className="relative">
            <img
              src="/racemaster.png"
              alt="RaceMaster 360"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover ring-2 ring-slate-600 group-hover:ring-green-500 transition-all"
            />
            <div className="absolute -top-1 -right-1 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-green-500 rounded-full ring-2 ring-slate-800"></div>
          </div>
          <span className="text-base sm:text-lg text-white font-bold tracking-tight">
            🏃 RaceMaster <span className="text-green-400">360</span>
          </span>
        </Link>

        {/* ================= CENTER : NAV LINKS (Desktop) ================= */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-2">
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

        {/* ================= RIGHT : ADMIN (Desktop) ================= */}
        <div className="hidden md:flex justify-center">
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
                  <span className="hidden lg:inline">Admin</span>
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
                <span className="hidden lg:inline">Admin Login</span>
                <span className="lg:hidden">Login</span>
              </Button>
            </Link>
          )}
        </div>

        {/* ================= MOBILE MENU BUTTON ================= */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-700 bg-slate-800/98 backdrop-blur-sm">
          <nav className="px-4 py-3 space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "block px-4 py-2 rounded-lg text-sm font-medium transition-all text-slate-300 flex items-center gap-2",
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
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "block px-4 py-2 rounded-lg text-sm font-medium transition-all text-slate-300 flex items-center gap-2",
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

            <div className="pt-2 border-t border-slate-700">
              {user && user.role === "admin" ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/admin");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                  >
                    <span>📊</span>
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-700 flex items-center gap-2"
                  >
                    <span>🚪</span>
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg text-sm font-semibold bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                >
                  <span>🔐</span>
                  Admin Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
