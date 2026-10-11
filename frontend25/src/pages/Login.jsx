import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sparkles } from 'lucide-react';
import emailImg from "../assets/email.png";
import passImg from "../assets/passimg.png";

const images = [
  "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg",
  "https://images.pexels.com/photos/3184404/pexels-photo-3184404.jpeg",
  "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg",
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
    }, 2000);

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
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    const result = await login(formData.email, formData.password, userType);

    if (!result.success) {
      setError(result.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#EDE7FF] flex items-center justify-center">
      <div className="w-[55%]  h-[550px] max-w-[1600px] bg-white rounded-[30px] shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT PANEL */}
        <div className="px-14 py-16">
          <h2 className="text-center text-xl font-bold mb-2">LOGIN</h2>
          <p className="text-center text-gray-800 mb-7">
            Placify — Place Your Future.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2">Login as</p>
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#F3EDFF] p-1">
                <button
                  type="button"
                  onClick={() => setUserType('student')}
                  className={`py-2 rounded-lg text-sm font-semibold transition ${userType === 'student' ? 'bg-[#443097] text-white shadow-md' : 'text-[#443097]'}`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('company')}
                  className={`py-2 rounded-lg text-sm font-semibold transition ${userType === 'company' ? 'bg-[#443097] text-white shadow-md' : 'text-[#443097]'}`}
                >
                  Company
                </button>
              </div>
            </div>

            <div className="relative">
              <img
                src={emailImg}
                alt="email icon"
                className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2"
              />
              <input
                type="text"
                name="email"
                placeholder="Email or Username"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-10 py-3 bg-[#F3EDFF] text-[#1f2937] placeholder:text-gray-500 border border-[#d9d0ff] rounded-xl outline-none focus:border-[#443097] focus:ring-2 focus:ring-[#d9d0ff] h-[1cm]"
              />
            </div>

            <div className="relative">
              <img
                src={passImg}
                alt="password icon"
                className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2"
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-10 pr-12 py-3 bg-[#F3EDFF] text-[#1f2937] placeholder:text-gray-500 border border-[#d9d0ff] rounded-xl outline-none focus:border-[#443097] focus:ring-2 focus:ring-[#d9d0ff] h-[1cm]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#443097]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#443097] text-white mt-4 py-2 rounded-xl shadow-md h-[1cm] disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login Now"}
            </button>
            
            <Link to="/forget-password" className="text-sm text-[#2b128f] font-semibold hover:underline block text-right">
              Forgot password?
            </Link>
          </form>


          <div className="mt-4 space-y-3">
            <div id="g_id_signin"></div>
            <div className="text-center font-semibold text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#2b128f] font-semibold hover:underline">
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="relative bg-linear-to-br from-[#5f4ea1] via-[#443097] to-[#2b128f] flex items-center justify-center p-12">
          <div className="bg-[#5f4ea1] backdrop-blur-xl rounded-[25px] p-4 shadow-2xl">
            <img
              src={images[index]}
              alt="User"
              className="rounded-[20px] w-[260px] h-[320px] object-cover transition-all duration-700"
            />
          </div>

          <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-yellow-500 text-xl">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

      </div>
    </div>
  );
}

// Load Google Identity Services button
// We intentionally put this outside the component to avoid multiple listeners in hot reload — handled via effect below.
