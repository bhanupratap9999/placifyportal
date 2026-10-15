import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Download, ExternalLink, ShieldCheck, Sparkles, X } from 'lucide-react';

export default function PaymentSuccessModal({ isOpen, onClose, paymentData, onStartLearning }) {
  if (!isOpen || !paymentData) return null;

  const payment = paymentData.payment || {};
  const fulfillment = paymentData.fulfillment || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border border-indigo-500/30 text-white shadow-2xl p-6 md:p-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Glowing background blur */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Success Icon */}
          <div className="relative flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-10 h-10" />
            </motion.div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Razorpay Verified Payment
            </span>

            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-1">
              Payment Successful!
            </h2>
            <p className="text-sm text-slate-300 max-w-sm mb-6">
              Thank you! Your transaction is complete and your access has been instantly unlocked.
            </p>
          </div>

          {/* Receipt Card */}
          <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4 mb-6 space-y-2.5 text-xs md:text-sm">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-slate-400">Item Purchased</span>
              <span className="font-semibold text-white text-right max-w-[60%] truncate">
                {payment.itemName || 'Placify Access'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Amount Paid</span>
              <span className="text-base font-bold text-emerald-400">
                ₹{payment.amount || 0}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Payment ID</span>
              <span className="font-mono text-xs text-indigo-300 truncate max-w-[60%]">
                {payment.paymentId || 'pay_verified'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Receipt No.</span>
              <span className="font-mono text-xs text-slate-300">
                {payment.receipt || 'rcpt_placify'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Date</span>
              <span className="text-slate-300">
                {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : new Date().toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <span className="text-slate-400">Status</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 uppercase tracking-wide">
                Captured / Success
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onClose();
                if (onStartLearning) onStartLearning();
              }}
              className="flex-1 py-3 px-4 rounded-xl font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" /> Start Accessing Now
            </button>

            <button
              onClick={handlePrint}
              className="py-3 px-4 rounded-xl font-medium bg-white/10 hover:bg-white/15 text-slate-200 text-sm border border-white/10 flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" /> Print Receipt
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
