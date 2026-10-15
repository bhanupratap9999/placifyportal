import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Sparkles, Mail, Lock, User, Eye, EyeOff, 
  GraduationCap, Building2, ArrowRight, ShieldCheck 
} from 'lucide-react';

const images = [
  "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3184404/pexels-photo-3184404.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800",
];

export default function SignUpPage() {
  const [index, setIndex] = useState(0);
  const [userType, setUserType] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, googleLogin } = useAuth();

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
                if (!result.success) setError(result.message || 'Google signup failed');
              } catch (err) {
                console.error('Google callback error', err);
                setError('Google signup failed');
              } finally {
                setLoading(false);
              }
            }
          });

          window.google.accounts.id.renderButton(
            document.getElementById('g_id_signup'),
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

    if (!formData.username || !formData.email || !formData.password || !formData.fullName) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    const userData = {
      username: formData.username.trim().toLowerCase(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      userType: userType,
      profile: {
        fullName: formData.fullName.trim()
      }
    };

    const result = await signup(userData);

    if (!result.success) {
      setError(result.message || "Error creating your account. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#030014] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Glassmorphic Card Container */}
      <div className="w-full max-w-4xl my-6 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl backdrop-blur-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden z-10">

        {/* LEFT PANEL - SIGN UP FORM */}
        <div className="p-8 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Header / Brand */}
            <div className="mb-6">
              <Link to="/" className="inline-flex items-center gap-2 mb-3 group">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-600/30 group-hover:scale-105 transition-transform">
                  P
                </span>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                  Placify
                </span>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Create Account
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Start your career acceleration and internship journey today.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                {error}
              </div>
            )}

            {/* User Type Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => setUserType("student")}
                className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  userType === "student"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType("company")}
                className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  userType === "company"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Company</span>
              </button>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  {userType === "company" ? "Company / Org Name" : "Full Name"}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={userType === "company" ? "Acme Technologies Pvt Ltd" : "Bhanu Pratap Singh"}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Username</label>
                <div className="relative">
                  <span className="text-slate-500 font-bold text-xs absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">@</span>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="bhanu_dev"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Social Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-3 text-slate-400 font-semibold tracking-wider">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Signup Button */}
            <div id="g_id_signup" className="flex justify-center min-h-[44px]"></div>
          </div>

          {/* Footer Link */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT PANEL - VISUAL SPOTLIGHT */}
        <div className="hidden md:flex relative bg-gradient-to-br from-purple-900/60 via-indigo-950/80 to-slate-950 p-10 flex-col justify-between overflow-hidden border-l border-white/10">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold backdrop-blur-md mb-4">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              Verified Placements & AI Matching
            </div>
            <h3 className="text-2xl font-bold text-white leading-snug">
              Unlock Tier-1 Internships & Industry Ready Courses.
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Join thousands of students building real-world skills, cracking technical interviews, and landing career opportunities.
            </p>
          </div>

          {/* Image carousel frame */}
          <div className="relative my-6 z-10">
            <div className="relative mx-auto w-64 h-72 rounded-2xl overflow-hidden border border-white/20 shadow-2xl shadow-purple-950/80">
              <img
                src={images[index]}
                alt="Student success"
                className="w-full h-full object-cover transition-all duration-700 transform hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <p className="text-xs font-semibold text-white">Full-stack & AI Mentorship</p>
                <p className="text-[10px] text-purple-300">Certified by top corporate partners</p>
              </div>
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -bottom-3 -right-2 bg-slate-900/90 backdrop-blur-md border border-white/15 px-3 py-2 rounded-xl shadow-xl flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div className="text-left">
                <p className="text-[10px] font-bold text-white">Razorpay Secured</p>
                <p className="text-[9px] text-slate-400">100% Guaranteed</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-white/10">
            <span>© 2026 Placify Portal</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Recruitment
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
