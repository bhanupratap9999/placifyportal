import React, { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'
import PricingModal from './PricingModal'
import PaymentSuccessModal from './PaymentSuccessModal'

export default function Navbar() {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [successPaymentData, setSuccessPaymentData] = useState(null)

  return (
    <>
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
              <li><button onClick={() => navigate('/stdashboard')} className="nav-item hover:text-white transition-colors">Internships <FiChevronDown className="chev"/></button></li>
              <li><button onClick={() => navigate('/courses')} className="nav-item hover:text-white transition-colors">Courses</button></li>
              <li><button onClick={() => setShowPricingModal(true)} className="nav-item hover:text-white transition-colors flex items-center gap-1"><Crown className="w-3.5 h-3.5 text-amber-300" /> Pricing</button></li>
              <li><button onClick={() => navigate('/stdashboard')} className="nav-item hover:text-white transition-colors">Tools & Education <FiChevronDown className="chev"/></button></li>
              <li><button onClick={() => navigate('/stdashboard')} className="nav-item hover:text-white transition-colors">About Us</button></li>
            </ul>
          </nav>

          <div className="nav-right">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowPricingModal(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30 hover:scale-105 transition-all cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-300" /> Pro Pass
                </button>
                <span className="text-indigo-200/90 font-medium text-sm border-r border-white/10 pr-4">
                  {user?.profile?.fullName || user?.username} <span className="text-xs text-indigo-400 capitalize px-2 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 ml-1.5">{user?.userType}</span>
                </span>
                <button className="login-btn py-2 px-4 text-xs font-semibold hover:bg-white/10" onClick={logout}>Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowPricingModal(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-indigo-200 border border-white/10 transition-colors"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-300" /> Pricing
                </button>
                <button className="login-btn py-2.5 px-5 text-sm font-semibold" onClick={() => navigate('/login')}>Log in</button>
                <button className="signup-btn py-2.5 px-5 text-sm font-semibold" onClick={() => navigate('/signup')}>Sign up</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Pricing / Razorpay Checkout Modal */}
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        onPaymentSuccess={(verifyData) => {
          setShowPricingModal(false)
          setSuccessPaymentData(verifyData)
        }}
      />

      {/* Success Modal */}
      <PaymentSuccessModal
        isOpen={Boolean(successPaymentData)}
        onClose={() => setSuccessPaymentData(null)}
        paymentData={successPaymentData}
        onStartLearning={() => navigate('/courses')}
      />
    </>
  )
}
