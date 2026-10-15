import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Sparkles, Send } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    // Simulate API reset request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-[#030014] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Glassmorphic Card Container */}
      <div className="w-full max-w-md my-6 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl backdrop-blur-2xl p-8 sm:p-10 z-10">
        
        {/* Brand / Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-600/30 group-hover:scale-105 transition-transform">
              P
            </span>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              Placify
            </span>
          </Link>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Reset Password
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {submitted 
              ? "We've dispatched recovery instructions to your email." 
              : "Enter your registered email address to receive recovery instructions."}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            {error}
          </div>
        )}

        {submitted ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Verification Link Sent</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Check your inbox at <span className="text-purple-300 font-medium">{email}</span> and click the link to configure a new password.
              </p>
            </div>
            <button
              onClick={() => { setSubmitted(false); setEmail(""); }}
              className="text-xs text-purple-400 hover:text-purple-300 underline font-medium"
            >
              Try another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Recovery Link</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Back to Login Footer */}
        <div className="text-center mt-6 pt-5 border-t border-white/10">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Login</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
