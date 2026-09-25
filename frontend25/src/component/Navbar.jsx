import React from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'

export default function Navbar() {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="nav-left">
          <a href="/" className="logo">
            <img src={logo} alt="Placify" className="w-8 h-8 rounded-lg shadow-md border border-white/10" />
            <span className="logo-text">Placify</span>
          </a>
        </div>

        <nav className="nav-center" aria-label="Main navigation">
          <ul className="nav-links">
            <li><button className="nav-item hover:text-white transition-colors">Internships <FiChevronDown className="chev"/></button></li>
            <li><button className="nav-item hover:text-white transition-colors">Platforms <FiChevronDown className="chev"/></button></li>
            <li><button className="nav-item hover:text-white transition-colors">Tools & Education <FiChevronDown className="chev"/></button></li>
            <li><button className="nav-item hover:text-white transition-colors">About Us <FiChevronDown className="chev"/></button></li>
            <li><button className="nav-item hover:text-white transition-colors">Partners</button></li>
          </ul>
        </nav>

        <div className="nav-right">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-indigo-200/90 font-medium text-sm border-r border-white/10 pr-4">
                {user?.profile?.fullName || user?.username} <span className="text-xs text-indigo-400 capitalize px-2 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 ml-1.5">{user?.userType}</span>
              </span>
              <button className="login-btn py-2 px-4 text-xs font-semibold hover:bg-white/10" onClick={logout}>Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button className="login-btn py-2.5 px-5 text-sm font-semibold" onClick={() => navigate('/login')}>Log in</button>
              <button className="signup-btn py-2.5 px-5 text-sm font-semibold" onClick={() => navigate('/signup')}>Sign up</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
