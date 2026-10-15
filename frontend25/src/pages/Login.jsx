import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Sparkles, Mail, Lock, Eye, EyeOff, 
  GraduationCap, Building2, ArrowRight, ShieldCheck 
} from 'lucide-react';

const images = [
  "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3184404/pexels-photo-3184404.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800",
];

export default function LoginPage() {
  const [index, setIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("student");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const existing = document.getElementById('google-client-script');
    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.id = 'google-client-script';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        try {
          /* global google */
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
              setError('');
              setLoading(true);
              try {
                const idToken = response.credential;
                const result = await googleLogin(idToken);
                if (!result.success) setError(result.message || 'Google login failed');
              } catch (err) {
                console.error('Google callback error', err);
                setError('Google login failed');
              } finally {
                setLoading(false);
              }
            }
          });

          window.google.accounts.id.renderButton(
            document.getElementById('g_id_signin'),
            { theme: 'outline', size: 'large', width: '100%' }
          );
        } catch (err) {
          console.error('Error initializing Google Identity Services', err);
        }
      };
      document.body.appendChild(script);
    }
  }, [googleLogin]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    const result = await login(formData.email, formData.password, userType);
    if (!result.success) {
      setError(result.message || "Invalid credentials. Please verify your details.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#030014] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Glassmorphic Card Container */}
      <div className="w-full max-w-4xl my-6 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl backdrop-blur-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden z-10">

        {/* LEFT PANEL - FORM */}
        <div className="p-8 sm:p-12 flex flex-col justify-between">
          <div>
            {/* Header / Brand */}
            <div className="mb-6">
              <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-600/30 group-hover:scale-105 transition-transform">
                  P
                </span>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                  Placify
                </span>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome Back
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Access your internship vector, applications, and certified courses.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                {error}
              </div>
            )}

            {/* User Type Toggle */}
            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Login Account Type
              </label>
              <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10">
                <button
                  type="button"
                  onClick={() => setUserType('student')}
                  className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    userType === 'student'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25 scale-[1.02]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" /> Student
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('company')}
                  className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    userType === 'company'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25 scale-[1.02]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" /> Company
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/[0.04] text-white placeholder:text-slate-500 border border-white/10 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Password
                  </label>
                  <Link
                    to="/forget-password"
                    className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-11 py-3 bg-white/[0.04] text-white placeholder:text-slate-500 border border-white/10 rounded-xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    Sign In to Placify <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div id="g_id_signin" className="mt-4 flex justify-center min-h-[40px]"></div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6 pt-4 border-t border-white/[0.06]">
            Don't have an account yet?{" "}
            <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>

        {/* RIGHT PANEL - VISUAL SHOWCASE */}
        <div className="relative hidden md:flex flex-col items-center justify-between p-12 bg-gradient-to-br from-purple-950/70 via-slate-900 to-indigo-950/70 border-l border-white/10 overflow-hidden">
          {/* Ambient inner glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] pointer-events-none" />

          {/* Top badge */}
          <div className="relative z-10 self-start inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-indigo-200 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Verified Opportunities
          </div>

          {/* Floating Frame */}
          <div className="relative z-10 my-auto">
            <div className="relative rounded-2xl p-2 bg-gradient-to-b from-white/15 to-white/5 border border-white/15 shadow-2xl backdrop-blur-xl">
              <img
                src={images[index]}
                alt="Placify Experience"
                className="rounded-xl w-64 h-80 object-cover transition-opacity duration-700 shadow-inner"
              />
              <div className="absolute -bottom-4 -left-4 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/15 shadow-xl backdrop-blur-xl flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div className="text-left">
                  <p className="text-xs font-bold text-white">500+ Partner Companies</p>
                  <p className="text-[10px] text-slate-400">Direct hiring pipelines</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom quote */}
          <div className="relative z-10 text-center max-w-xs">
            <p className="text-xs text-slate-300 italic">
              "Placify transformed how our university students land top-tier tech internships."
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
