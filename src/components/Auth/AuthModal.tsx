import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, UserPlus, LogIn, X, Zap, Check, Sparkles, Gift } from 'lucide-react';
import { useGFlix } from '../../context/GFlixContext';

export const AuthModal: React.FC = () => {
  const {
    currentUser,
    showAuthModal,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    registerUser,
    loginUser,
    pendingReferralCode,
    detectedSponsorName,
    lookupSponsorByCode,
  } = useGFlix();

  // Registration form fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState(() => pendingReferralCode || 'sDg2f');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Sync with pending referral code when invited via link
  useEffect(() => {
    if (pendingReferralCode) {
      setReferralCode(pendingReferralCode);
    }
  }, [pendingReferralCode]);

  // Dynamic sponsor lookup based on current referral code
  const currentSponsorName = lookupSponsorByCode(referralCode || 'sDg2f').name;

  // Login form field
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!showAuthModal) return null;

  const isSignUp = authModalMode === 'signup';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isSignUp) {
      // Validate PH Mobile Number
      const cleanPhoneDigits = phoneNumber.replace(/\D/g, '');
      if (!cleanPhoneDigits) {
        setErrorMsg('Please enter your Philippine mobile number (e.g. 09171234567).');
        return;
      }
      if (
        !(
          (cleanPhoneDigits.length === 11 && cleanPhoneDigits.startsWith('09')) ||
          (cleanPhoneDigits.length === 10 && cleanPhoneDigits.startsWith('9')) ||
          (cleanPhoneDigits.length === 12 && cleanPhoneDigits.startsWith('639'))
        )
      ) {
        setErrorMsg('Please enter a valid PH mobile number starting with 09 (11 digits) or +639.');
        return;
      }

      if (!email.trim()) {
        setErrorMsg('Please enter your email address.');
        return;
      }
      if (!password) {
        setErrorMsg('Please create a password.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (!agreeTerms) {
        setErrorMsg('You must agree to the terms and privacy policy.');
        return;
      }

      setIsSubmitting(true);
      // Format standard PH mobile representation: 09XX-XXX-XXXX
      let formattedPhone = cleanPhoneDigits;
      if (formattedPhone.startsWith('63')) {
        formattedPhone = '0' + formattedPhone.slice(2);
      } else if (formattedPhone.length === 10 && formattedPhone.startsWith('9')) {
        formattedPhone = '0' + formattedPhone;
      }

      const displayPhone = `${formattedPhone.slice(0, 4)}-${formattedPhone.slice(4, 7)}-${formattedPhone.slice(7)}`;
      const derivedFullName = username.trim() || `User ${formattedPhone.slice(-4)}`;
      const effectiveUsername = username.trim() || `user_${formattedPhone.slice(-4)}`;

      const res = await registerUser(
        derivedFullName,
        email,
        displayPhone,
        password,
        effectiveUsername,
        referralCode.trim() || 'sDg2f',
        currentSponsorName
      );
      setIsSubmitting(false);

      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        // Reset form
        setPhoneNumber('');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } else {
      // Login
      if (!loginIdentifier.trim() || !loginPassword) {
        setErrorMsg('Please enter your mobile number, email, or username and password.');
        return;
      }

      setIsSubmitting(true);
      const res = await loginUser(loginIdentifier, loginPassword);
      setIsSubmitting(false);

      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setLoginPassword('');
      }
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-lg overflow-y-auto"
        onClick={(e) => {
          if (currentUser && e.target === e.currentTarget) closeAuthModal();
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-[420px] my-auto bg-[#070e1e] border border-sky-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(56,189,248,0.28)] text-slate-100 overflow-hidden"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button - only displayed if an active session already exists */}
          {currentUser && (
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors z-10 cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Mandatory Gateway Badge when not signed in */}
          {!currentUser && (
            <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-950/80 border border-sky-500/50 text-[11px] text-sky-300 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              <span>Mandatory Member Verification</span>
            </div>
          )}

          {/* Header with App Icon & Title exactly matching reference */}
          <div className="flex items-center gap-3.5 mb-5 sm:mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 border border-sky-400/40 shadow-lg shadow-sky-500/25 flex items-center justify-center text-white shrink-0">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                {isSignUp ? 'Create account' : 'Welcome back'}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                {isSignUp
                  ? 'Registration is required to access Sun Belt Inc'
                  : 'Sign in to access your Sun Belt Inc wallet'}
              </p>
            </div>
          </div>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="mb-4 p-2.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
            {isSignUp ? (
              <>
                {/* Invitation Welcome Banner */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-sky-950/90 via-slate-900 to-indigo-950/90 border border-sky-500/40 text-xs shadow-inner space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-sky-300 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                      <span>{pendingReferralCode ? 'Invitation Link Applied' : 'Referral Access Gateway'}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
                      +₱30.00 Welcome Bonus
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Sponsor: <strong className="text-cyan-300 font-semibold">{currentSponsorName}</strong> (Code:{' '}
                    <span className="font-mono text-cyan-200">{referralCode}</span>)
                  </div>
                </div>

                {/* Mobile Number PH */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-200">
                    Mobile Number (PH)
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-semibold text-xs sm:text-sm select-none pointer-events-none">
                      🇵🇭 +63
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="917 123 4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-white text-slate-900 rounded-xl pl-20 pr-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-400 shadow-sm transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Enter valid 10 or 11-digit PH mobile number (e.g. 0917-123-4567)
                  </p>
                </div>

                {/* Username */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-200">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white text-slate-900 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-400 shadow-sm transition-all"
                  />
                </div>

                {/* Email address */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-200">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white text-slate-900 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-400 shadow-sm transition-all"
                  />
                </div>

                {/* Password with eye toggle */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-200">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder=""
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white text-slate-900 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-400 shadow-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-500 hover:text-sky-600 transition-colors p-1"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-sky-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-sky-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm password with eye toggle */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-200">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder=""
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white text-slate-900 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-400 shadow-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-500 hover:text-sky-600 transition-colors p-1"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 text-sky-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-sky-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Referral code with Sponsor note */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-200">
                      Referral code
                    </label>
                    {referralCode && (
                      <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Code Applied
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="Enter referral code"
                    className="w-full bg-white text-slate-900 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-400 shadow-sm transition-all"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>
                      Sponsor: <span className="text-cyan-300 font-semibold">{currentSponsorName}</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium">₱30 Bonus Ready</span>
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div className="pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <div 
                      onClick={() => setAgreeTerms(!agreeTerms)}
                      className={`w-4 h-4 rounded flex items-center justify-center transition-colors border ${
                        agreeTerms 
                          ? 'bg-sky-500 border-sky-400 text-white' 
                          : 'bg-slate-900 border-slate-700 text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="text-xs text-slate-300">
                      I agree to the terms and privacy policy
                    </span>
                  </label>
                </div>

                {/* Submit Action: Crisp White Pill Button with blue icon & text matching reference */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-3 py-2.5 sm:py-3 rounded-xl bg-white hover:bg-slate-100 text-sky-600 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4 text-sky-600" />
                  <span>{isSubmitting ? 'Creating wallet...' : 'Create wallet'}</span>
                </button>
              </>
            ) : (
              <>
                {/* Login Mode Fields */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-200">
                    Mobile Number (PH), Email, or Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter PH mobile (09XX...), email, or username"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full bg-white text-slate-900 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-400 shadow-sm transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-200">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-white text-slate-900 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-400 shadow-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-500 hover:text-sky-600 transition-colors p-1"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-sky-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-sky-500" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 py-2.5 sm:py-3 rounded-xl bg-white hover:bg-slate-100 text-sky-600 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4 text-sky-600" />
                  <span>{isSubmitting ? 'Signing in...' : 'Sign in to wallet'}</span>
                </button>
              </>
            )}
          </form>

          {/* Footer toggle link */}
          <div className="text-center mt-4 pt-2">
            <button
              type="button"
              onClick={() => {
                openAuthModal(isSignUp ? 'login' : 'signup');
                setErrorMsg('');
              }}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <span className="font-bold text-white hover:text-sky-400 transition-colors">
                    Login
                  </span>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <span className="font-bold text-white hover:text-sky-400 transition-colors">
                    Register
                  </span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
