import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Zap, Crown, Rocket, ShieldCheck, 
  CreditCard, Sparkles, X, ArrowRight, Loader2 
} from 'lucide-react';
import { initiateRazorpayPayment } from '../utils/razorpay';

export default function PricingModal({ isOpen, onClose, onPaymentSuccess }) {
  const [loadingPlan, setLoadingPlan] = useState(null);

  if (!isOpen) return null;

  const plans = [
    {
      id: 'free',
      name: 'Starter',
      price: '₹0',
      period: 'forever',
      description: 'Essential portal features to get started with basic internship search.',
      badge: 'Current',
      icon: Zap,
      accent: 'border-slate-700 bg-slate-900/60',
      buttonText: 'Active Plan',
      disabled: true,
      features: [
        'Browse 10,000+ internship openings',
        'Apply to up to 5 opportunities/month',
        'Access to community microtasks',
        'Standard student profile'
      ]
    },
    {
      id: 'pro_pass',
      name: 'Placify Pro Pass',
      price: '₹999',
      originalPrice: '₹2,499',
      period: 'lifetime access',
      description: 'The definitive boost for high-performing students aiming for top placements.',
      badge: 'Most Popular',
      popular: true,
      icon: Crown,
      accent: 'border-purple-500/50 bg-gradient-to-b from-purple-950/40 via-slate-900 to-indigo-950/40 shadow-2xl shadow-purple-600/20',
      buttonText: 'Upgrade with Razorpay',
      features: [
        'Unlimited verified internship applications',
        'Verified Student Candidate Badge ⭐',
        'Full access to all Premium Courses & Videos',
        'AI Resume Score & Job Description Matcher',
        'Direct priority recruiter email dispatch',
        'Early access to newly posted openings'
      ]
    },
    {
      id: 'pro_monthly',
      name: 'Pro Monthly',
      price: '₹499',
      period: 'per month',
      description: 'Flexible monthly subscription for active internship search periods.',
      badge: 'Flexible',
      icon: Rocket,
      accent: 'border-indigo-500/30 bg-slate-900/60',
      buttonText: 'Subscribe with Razorpay',
      features: [
        'Unlimited internship applications',
        'Access to all company courses & videos',
        'AI Job Description match analysis',
        'Priority applicant queue placement',
        'Cancel anytime with 1 click'
      ]
    }
  ];

  const handleSelectPlan = async (plan) => {
    if (plan.disabled) return;

    setLoadingPlan(plan.id);

    await initiateRazorpayPayment({
      itemType: 'subscription',
      planId: plan.id,
      notes: {
        planName: plan.name
      },
      onSuccess: (verifyData) => {
        setLoadingPlan(null);
        if (onPaymentSuccess) {
          onPaymentSuccess(verifyData);
        }
      },
      onError: (err) => {
        setLoadingPlan(null);
        alert(err.message || 'Payment was not completed');
      },
      onClose: () => {
        setLoadingPlan(null);
      }
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl my-8 rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-2xl p-6 md:p-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Transparent Pricing
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent mb-3">
              Accelerate Your Placement
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              Secure top internships and master industry-level skills with Razorpay instant checkout.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isPopular = plan.popular;
              const isLoading = loadingPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col justify-between rounded-2xl border p-6 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${plan.accent}`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-indigo-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      {!isPopular && plan.badge && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mb-4 min-h-[32px]">{plan.description}</p>

                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-3xl md:text-4xl font-extrabold text-white">{plan.price}</span>
                      {plan.originalPrice && (
                        <span className="text-sm line-through text-slate-500">{plan.originalPrice}</span>
                      )}
                      <span className="text-xs text-slate-400">/ {plan.period}</span>
                    </div>

                    <div className="border-t border-white/10 pt-4 mb-6">
                      <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">What's included</p>
                      <ul className="space-y-2.5 text-xs text-slate-300">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={plan.disabled || isLoading}
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      plan.disabled
                        ? 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                        : isPopular
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 hover:scale-[1.02]'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Launching Razorpay...
                      </>
                    ) : (
                      <>
                        {!plan.disabled && <CreditCard className="w-4 h-4" />}
                        {plan.buttonText}
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Secure Payment Footer Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-slate-800 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 256-bit SSL Secure Checkout
            </span>
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-indigo-400" /> UPI, Credit/Debit Cards, NetBanking, EMI
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              ⚡ Powered by Razorpay
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
