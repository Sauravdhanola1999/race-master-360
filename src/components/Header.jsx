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
      "px-3 py-1.5 rounded-md text-sm font-medium transition",
      location.pathname === path
        ? "bg-indigo-600 text-white"
        : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
    );

  return (
    // <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
    <header className="sticky top-0 z-50 bg-black border-b border-white/20 ">

      <div className="max-w-6xl  px-4 py-4 flex items-center justify-between ">
        {/* BRAND */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/racemaster.png"
            alt="RaceMaster 360"
            className="h-10 w-10 object-cover rounded-2xl"
          />
          <span className="text-lg text-white font-bold tracking-tight">
            RaceMaster 360
          </span>
        </Link>
         

         <div className="mr-[7px] flex item-center justify-between">
         <nav className="flex items-center gap-2 text-white">
          <Link to="/" className={navBtn("/")}>
            <span className="text-white">Home</span>
          </Link>

          <Link to="/live/1" className={navBtn("/live/1")}>
           <span className="text-white">Live</span> 
          </Link>

          {/* ADMIN */}
          {user && user.role === "admin" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="ml-2 text-white bg-indigo-600 hover:bg-indigo-700 text-white flex items-center"
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

              <DropdownMenuContent align="end" className="w-40 ">
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
                className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Admin Login
              </Button>
            </Link>
          )}
        </nav>
         </div>
        {/* NAV */}
       
      </div>
    </header>
  );
}
