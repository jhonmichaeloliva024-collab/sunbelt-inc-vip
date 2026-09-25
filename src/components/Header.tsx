import React, { useState } from 'react';
import { useGFlix } from '../context/GFlixContext';
import { Server, Wallet, Activity, User, ShieldCheck, LogOut, UserPlus, LogIn } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    wallet,
    setActiveTab,
    currentUser,
    logoutUser,
    openAuthModal,
    isAdminUnlocked,
    openAdminDashboard,
  } = useGFlix();

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-300 bg-clip-text text-transparent">
                Sun Belt Inc
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-amber-400 bg-amber-950/80 border border-amber-800/60 px-1.5 py-0.5 rounded-md uppercase">
                Cloud
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Online Server Leasing
            </p>
          </div>
        </div>

        {/* Live Server Indicator & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Portal Indicator Badge if authenticated */}
          {isAdminUnlocked && (
            <button
              onClick={openAdminDashboard}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-950/90 border border-cyan-500/60 text-cyan-300 text-xs font-bold hover:bg-cyan-900 transition-colors shadow-sm"
              title="Open Admin Screening Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Admin Portal</span>
            </button>
          )}

          {/* Live Node Status */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Server Nodes: <strong className="text-emerald-400 font-mono">99.98% Active</strong></span>
          </div>

          {/* Wallet Balance Chip */}
          <div 
            onClick={() => setActiveTab('wallet')}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-1.5 cursor-pointer transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Balance</div>
              <div className="text-sm font-bold font-mono text-emerald-400">
                ₱{wallet.balancePhp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* User Profile / Auth Button */}
          <div className="relative">
            {currentUser ? (
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300 flex items-center justify-center font-bold text-[10px] uppercase">
                  {(currentUser.username || currentUser.fullName || currentUser.phoneNumber || 'SB').slice(0, 2)}
                </div>
                <span className="font-semibold hidden sm:inline max-w-[110px] truncate">
                  {currentUser.username || currentUser.fullName.split(' ')[0] || currentUser.phoneNumber}
                </span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('signup')}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-semibold text-cyan-400 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            )}

            {/* User Dropdown */}
            {showUserDropdown && currentUser && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl p-2.5 shadow-2xl z-50 space-y-2 text-xs">
                <div className="p-2 border-b border-slate-800">
                  <div className="font-bold text-white truncate">{currentUser.fullName}</div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">{currentUser.email}</div>
                  <div className="text-[10px] text-cyan-400 font-mono mt-0.5">ID: {currentUser.id}</div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      openAuthModal('signup');
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-left"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Register New Account</span>
                  </button>
                  <button
                    onClick={() => {
                      openAuthModal('login');
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-left"
                  >
                    <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Switch Account</span>
                  </button>
                  <button
                    onClick={() => {
                      logoutUser();
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-rose-950/60 text-rose-400 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
