import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Lock, KeyRound, X, AlertCircle } from 'lucide-react';
import { useGFlix } from '../../context/GFlixContext';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { verifyAndUnlockAdmin } = useGFlix();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;

    setIsSubmitting(true);
    setError(false);

    // Verify admin code 124688
    setTimeout(() => {
      const ok = verifyAndUnlockAdmin(pin);
      setIsSubmitting(false);
      if (ok) {
        setPin('');
        onSuccess();
      } else {
        setError(true);
      }
    }, 200);
  };

  const handleQuickKey = (digit: string) => {
    if (pin.length < 10) {
      setPin((prev) => prev + digit);
      setError(false);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          className="bg-slate-900 border border-cyan-900/60 rounded-3xl p-6 max-w-sm w-full space-y-5 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle cyber background glow */}
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-2 pt-2">
            <div className="w-13 h-13 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/50">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-white tracking-wide">
                Admin Screening Gateway
              </h3>
              <p className="text-[11px] text-slate-400 max-w-[240px]">
                Enter master authorization key to view user cloud registry & security records
              </p>
            </div>
          </div>

          {/* Keypad and PIN Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <div className="relative">
                <input
                  type="password"
                  autoFocus
                  maxLength={10}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError(false);
                  }}
                  placeholder="••••••"
                  className={`w-full bg-slate-950/90 border ${
                    error ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-800 focus:border-cyan-500'
                  } rounded-2xl px-4 py-3 text-center text-xl font-mono tracking-widest text-cyan-300 placeholder:text-slate-600 focus:outline-none transition-all`}
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {error && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 justify-center">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Invalid admin passcode. Access denied.</span>
                </div>
              )}
            </div>

            {/* Quick Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2 py-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleQuickKey(digit)}
                  className="py-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 text-white font-mono text-base font-semibold transition-all active:scale-95"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPin('')}
                className="py-2.5 rounded-xl bg-slate-950/70 hover:bg-rose-950/40 border border-slate-800/80 text-rose-400 text-xs font-semibold uppercase tracking-wider transition-all"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleQuickKey('0')}
                className="py-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 text-white font-mono text-base font-semibold transition-all active:scale-95"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="py-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 text-slate-400 text-xs font-semibold uppercase transition-all"
              >
                ⌫
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !pin}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              {isSubmitting ? 'Authenticating...' : 'Authorize Admin Access'}
            </button>
          </form>

          {/* Policy Screening Compliance Note */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 text-center">
            <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
              SECURE RECORD SCREENING • ENCRYPTED STORAGE PROTOCOL
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
