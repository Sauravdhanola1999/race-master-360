import React, { useContext, useState, useEffect, useRef } from "react";
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
  const menuRef = useRef(null);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target) && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  function handleLogout() {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  }

  return (
    <header ref={menuRef} className="fixed top-0 left-0 right-0 z-50 w-full md:max-w-full bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 shadow-lg overflow-hidden">
      <div className="max-w-6xl mx-auto px-2 sm:px-3 md:px-6 h-14 sm:h-16 flex items-center justify-between gap-1 sm:gap-2">
        {/* ================= LEFT : BRAND ================= */}
        <Link to="/" className="flex items-center gap-1 sm:gap-1.5 md:gap-3 shrink-0 group min-w-0 max-w-[30%] sm:max-w-none" onClick={() => setMobileMenuOpen(false)}>
          <div className="relative shrink-0">
            <img
              src="/racemaster.png"
              alt="RaceMaster 360"
              className="h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 rounded-lg object-cover ring-2 ring-slate-600 group-hover:ring-green-500 transition-all"
            />
            <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-3 md:w-3 bg-green-500 rounded-full ring-2 ring-slate-800"></div>
          </div>
          <span className="text-xs sm:text-sm md:text-lg text-white font-bold tracking-tight truncate">
            <span className="hidden sm:inline">RaceMaster </span>
            <span className="text-green-400">360</span>
          </span>
        </Link>

        {/* ================= CENTER : NAV LINKS (Desktop) ================= */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-1.5 lg:gap-2">
          <Link 
            to="/" 
            className={cn(
              "px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-sm font-medium transition-all text-slate-300 flex items-center gap-1 whitespace-nowrap",
              location.pathname === "/" 
                ? "bg-green-600 text-white" 
                : "hover:bg-slate-700 hover:text-white"
            )}
          >
            <span className="text-base">🏠</span>
            <span>Home</span>
          </Link>

          <Link 
            to="/live" 
            className={cn(
              "px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-sm font-medium transition-all text-slate-300 flex items-center gap-1.5 lg:gap-2 whitespace-nowrap",
              location.pathname.startsWith("/live") 
                ? "bg-green-600 text-white" 
                : "hover:bg-slate-700 hover:text-white"
            )}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span>Live</span>
          </Link>
        </nav>

        {/* ================= RIGHT : ADMIN (Desktop) ================= */}
        <div className="hidden md:flex justify-center items-center shrink-0">
          {user && user.role === "admin" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 lg:gap-2 shadow-md h-8 lg:h-9 px-2 lg:px-3"
                >
                  <Avatar className="h-5 w-5 lg:h-6 lg:w-6">
                    <AvatarImage src="/image.png" alt="Admin" />
                    <AvatarFallback className="bg-blue-500 text-white text-xs font-medium">
                      {user.email?.[0]?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm lg:text-base">⚙️</span>
                  <span className="hidden lg:inline whitespace-nowrap">Admin</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40 bg-slate-800 border border-slate-700 shadow-xl">
                <DropdownMenuItem 
                  onClick={() => navigate("/admin")}
                  className="text-slate-200 hover:bg-slate-700 hover:text-white flex items-center gap-2 cursor-pointer"
                >
                  <span>📊</span>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-400 hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
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
                className="bg-green-600 hover:bg-green-700 text-white shadow-md font-semibold flex items-center gap-1.5 lg:gap-2 h-8 lg:h-9 px-2 lg:px-3"
              >
                <span className="text-sm lg:text-base">🔐</span>
                <span className="hidden lg:inline whitespace-nowrap">Admin Login</span>
                <span className="lg:hidden whitespace-nowrap">Login</span>
              </Button>
            </Link>
          )}
        </div>

        {/* ================= MOBILE MENU BUTTON ================= */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white active:bg-slate-600 transition-colors touch-manipulation min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
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
        <div className="md:hidden border-t border-slate-700 bg-slate-800/98 backdrop-blur-sm animate-in slide-in-from-top duration-200">
          <nav className="px-3 sm:px-4 py-3 space-y-1.5">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "block px-4 py-3 rounded-lg text-sm font-medium transition-all text-slate-300 flex items-center gap-2 min-h-[44px] touch-manipulation",
                location.pathname === "/"
                  ? "bg-green-600 text-white"
                  : "active:bg-slate-700 hover:bg-slate-700 hover:text-white"
              )}
            >
              <span className="text-base">🏠</span>
              <span>Home</span>
            </Link>

            <Link
              to="/live"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "block px-4 py-3 rounded-lg text-sm font-medium transition-all text-slate-300 flex items-center gap-2 min-h-[44px] touch-manipulation",
                location.pathname.startsWith("/live")
                  ? "bg-green-600 text-white"
                  : "active:bg-slate-700 hover:bg-slate-700 hover:text-white"
              )}
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span>Live</span>
            </Link>

            <div className="pt-2 border-t border-slate-700 mt-2">
              {user && user.role === "admin" ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/admin");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-300 active:bg-slate-700 hover:bg-slate-700 hover:text-white flex items-center gap-2 min-h-[44px] touch-manipulation"
                  >
                    <span className="text-base">📊</span>
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-400 active:bg-slate-700 hover:bg-slate-700 flex items-center gap-2 min-h-[44px] touch-manipulation"
                  >
                    <span className="text-base">🚪</span>
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-semibold bg-green-600 active:bg-green-700 hover:bg-green-700 text-white flex items-center justify-center gap-2 min-h-[44px] touch-manipulation"
                >
                  <span className="text-base">🔐</span>
                  <span>Admin Login</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
