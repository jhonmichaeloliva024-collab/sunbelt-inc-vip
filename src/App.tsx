import React from 'react';
import { GFlixProvider, useGFlix } from './context/GFlixContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/Home/HomeTab';
import { LeaseTab } from './components/Lease/LeaseTab';
import { InviteTab } from './components/Invite/InviteTab';
import { WalletTab } from './components/Wallet/WalletTab';
import { NotificationToast } from './components/NotificationToast';
import { AdminDashboardModal } from './components/Admin/AdminDashboardModal';
import { AuthModal } from './components/Auth/AuthModal';
import { Server, Shield } from 'lucide-react';

function MainAppContent() {
  const {
    activeTab,
    setActiveTab,
    showAdminModal,
    closeAdminDashboard,
    currentUser,
    pendingReferralCode,
    detectedSponsorName,
    openAuthModal,
  } = useGFlix();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      <Header />

      {/* Sticky Top Invitation Notice when arriving through an invitation link */}
      {!currentUser && pendingReferralCode && (
        <div className="bg-gradient-to-r from-cyan-950 via-indigo-950 to-slate-950 border-b border-cyan-500/40 px-4 py-2 text-xs flex items-center justify-between gap-3 shadow-lg z-30">
          <div className="flex items-center gap-2 truncate">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            <span className="truncate text-slate-200">
              Invited by <strong className="text-cyan-300 font-semibold">{detectedSponsorName}</strong> (Code:{' '}
              <span className="font-mono text-cyan-200 font-bold">{pendingReferralCode}</span>) •{' '}
              <span className="text-emerald-400 font-semibold">₱30.00 Welcome Bonus</span> ready
            </span>
          </div>
          <button
            onClick={() => openAuthModal('signup')}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1 rounded-lg text-[11px] transition-colors shrink-0 shadow cursor-pointer"
          >
            Claim ₱30
          </button>
        </div>
      )}

      <BottomNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-20">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'lease' && <LeaseTab />}
        {activeTab === 'invite' && <InviteTab />}
        {activeTab === 'wallet' && <WalletTab />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 px-4 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Server className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-300">Sun Belt Inc Online Server Leasing</span>
            <span>© {new Date().getFullYear()} Sun Belt Inc Infrastructure.</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setActiveTab('lease')} className="hover:text-cyan-400 transition-colors cursor-pointer">
              GLK & CBN Servers
            </button>
            <button onClick={() => setActiveTab('invite')} className="hover:text-cyan-400 transition-colors cursor-pointer">
              Referral Program
            </button>
            <button onClick={() => setActiveTab('wallet')} className="hover:text-cyan-400 transition-colors cursor-pointer">
              GCash & PayMaya Wallet
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encrypted Ledger • 24/7 Node Monitor</span>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <NotificationToast />

      {/* Global Modals */}
      <AdminDashboardModal isOpen={showAdminModal} onClose={closeAdminDashboard} />
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <GFlixProvider>
      <MainAppContent />
    </GFlixProvider>
  );
}
