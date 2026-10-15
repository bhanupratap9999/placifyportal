import React from "react";
import { Link } from "react-router-dom";
import { Home, Compass, ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full bg-[#030014] text-white flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center p-8 sm:p-12 rounded-3xl bg-slate-900/60 border border-white/10 shadow-2xl backdrop-blur-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold backdrop-blur-md mb-6">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          Error 404 • Lost in Space
        </div>

        {/* 404 Huge Gradient Glow Text */}
        <h1 className="text-8xl sm:text-9xl font-black tracking-tighter bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-500 bg-clip-text text-transparent select-none drop-shadow-2xl">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
          Page Not Found
        </h2>
        <p className="text-sm text-slate-400 mt-3 leading-relaxed">
          The destination you are navigating to seems to have vanished or been moved to a new orbital vector.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/courses"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Courses</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
