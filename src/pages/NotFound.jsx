import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden track-field-bg flex items-center justify-center">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-red-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-yellow-500/10 blur-3xl" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12 text-center">
        <Card className="border border-slate-700 bg-slate-800 shadow-xl">
          <CardContent className="py-16 px-8">
            {/* 404 Number */}
            <div className="mb-6">
              <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500">
                404
              </h1>
            </div>

            {/* Emoji and Title */}
            <div className="mb-6">
              <div className="text-8xl mb-4 animate-bounce">🚫</div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Page Not Found
              </h2>
              <p className="text-slate-400 text-lg">
                Oops! The page you're looking for doesn't exist.
              </p>
            </div>

            {/* Description */}
            <div className="mb-8 space-y-2">
              <p className="text-slate-300">
                The route you tried to access might have been moved, deleted, or never existed.
              </p>
              <p className="text-slate-400 text-sm">
                🤔 Double-check the URL or navigate back to the home page.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all px-8"
                >
                  <span className="mr-2">🏠</span>
                  Go to Home
                </Button>
              </Link>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.history.back()}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white font-medium px-8"
              >
                <span className="mr-2">⬅️</span>
                Go Back
              </Button>
            </div>

            {/* Helpful Links */}
            <div className="mt-12 pt-8 border-t border-slate-700">
              <p className="text-slate-400 text-sm mb-4">Quick Links:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/"
                  className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
                >
                  🏠 Home
                </Link>
                <Link
                  to="/live"
                  className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
                >
                  🔴 Live
                </Link>
                <Link
                  to="/login"
                  className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
                >
                  🔐 Admin Login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

