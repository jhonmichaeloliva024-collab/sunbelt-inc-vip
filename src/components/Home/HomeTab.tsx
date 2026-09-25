import React, { useState, useEffect } from 'react';
import { useGFlix } from '../../context/GFlixContext';
import {
  Server,
  Zap,
  ArrowRight,
  PlusCircle,
  ArrowUpRight,
  Users,
  ShieldCheck,
  Cpu,
  Globe,
  Flame,
  Clock,
  Coins,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import serverBannerImg from '../../assets/images/gflix_server_banner_1786429257375.jpg';

export const HomeTab: React.FC = () => {
  const { setActiveTab, wallet, activeLeases, claimAllYields } = useGFlix();

  const activeServers = activeLeases.filter((l) => l.status === 'active');
  const totalDailyReturn = activeServers.reduce((acc, l) => acc + l.dailyReturnPhp, 0);
  const totalUnclaimed = activeServers.reduce((acc, l) => acc + l.unclaimedYieldPhp, 0);

  // Live animated statistics ticker simulation
  const [liveStats, setLiveStats] = useState({
    activeHashrate: 14892.4,
    totalNodes: 3412,
    payoutsToday: 482900,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveStats((prev) => ({
        activeHashrate: Number((prev.activeHashrate + (Math.random() * 2 - 1)).toFixed(1)),
        totalNodes: prev.totalNodes + (Math.random() > 0.7 ? 1 : 0),
        payoutsToday: prev.payoutsToday + Math.floor(Math.random() * 80 + 20),
      }));
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const newsFeed = [
    'User 0917***8921 just leased Server CBN-50 (₱1,500)',
    'User 0928***4102 withdrew ₱1,200.00 via GCash',
    'Server GLK-1 nodes expanded with +500 vCPU capacity in Manila DC',
    'User 0995***1120 claimed ₱740.00 compute return',
    'User 0906***7833 received ₱150.00 referral bonus',
  ];

  const [feedIndex, setFeedIndex] = useState(0);

  useEffect(() => {
    const feedTimer = setInterval(() => {
      setFeedIndex((prev) => (prev + 1) % newsFeed.length);
    }, 3500);
    return () => clearInterval(feedTimer);
  }, [newsFeed.length]);

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* Live Announcement Marquee */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border border-cyan-800/40 rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" /> Live Activity
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-xs text-slate-200 font-medium truncate transition-all animate-pulse">
            {newsFeed[feedIndex]}
          </p>
        </div>
        <button
          onClick={() => setActiveTab('lease')}
          className="text-xs font-semibold text-cyan-300 hover:text-white shrink-0 flex items-center gap-1"
        >
          View Lease <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hero Banner Section with Sun Belt Inc Automated Dashboard Info */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />
        <img
          src={serverBannerImg}
          alt="Sun Belt Inc High Performance Cloud Server Nodes"
          referrerPolicy="no-referrer"
          className="absolute right-0 top-0 bottom-0 w-full md:w-2/3 h-full object-cover object-right opacity-60 md:opacity-80"
        />

        <div className="relative z-20 p-6 sm:p-8 md:p-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Automated Cloud Server Leasing</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Next-Gen Cloud Compute Leasing on{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-300 bg-clip-text text-transparent">
              Sun Belt Inc
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Lease high-performance GLK & CBN server nodes with guaranteed daily compute returns.
            Enjoy 24/7 automated node monitoring, instant yield accumulation, and fast local payouts via GCash & PayMaya.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('lease')}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Server className="w-5 h-5" />
              <span>Explore Server Leases</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold px-5 py-3 rounded-2xl transition-all"
            >
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>Wallet Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Automated Metrics Dashboard Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Hashrate</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-white">
            {liveStats.activeHashrate.toLocaleString('en-US')} <span className="text-xs text-cyan-400 font-normal">MH/s</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" /> +3.4% high load compute
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Active Nodes</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-white">
            {liveStats.totalNodes.toLocaleString('en-US')} <span className="text-xs text-blue-400 font-normal">Nodes</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">GLK & CBN Clusters</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Daily Payouts</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-400">
            ₱{liveStats.payoutsToday.toLocaleString('en-US')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Processed in 24 hours</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Uptime SLA</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-white">
            99.98%
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Zero Downtime
          </p>
        </div>
      </div>

      {/* Active Servers Summary Bar (If User Has Active Servers) */}
      {activeServers.length > 0 && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/60 border border-cyan-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <h3 className="text-base font-bold text-white">Your Server Nodes Are Active</h3>
                <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-extrabold px-2 py-0.5 rounded-full">
                  {activeServers.length} Running
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Earning <strong className="text-emerald-400 font-mono">₱{totalDailyReturn.toFixed(2)}/day</strong> automatically.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 text-right flex-1 sm:flex-none">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Unclaimed Yield</div>
                <div className="text-lg font-bold font-mono text-emerald-400">
                  ₱{totalUnclaimed.toFixed(2)}
                </div>
              </div>

              <button
                onClick={claimAllYields}
                disabled={totalUnclaimed <= 0}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md ${
                  totalUnclaimed > 0
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-emerald-500/20 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Claim Yield</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Panel */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('lease')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 text-slate-200 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform mb-2">
              <Server className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">Lease Server</span>
            <span className="text-[10px] text-slate-400 mt-0.5">GLK & CBN Nodes</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-slate-200 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform mb-2">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">Deposit Funds</span>
            <span className="text-[10px] text-slate-400 mt-0.5">GCash & PayMaya</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-blue-950/20 text-slate-200 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform mb-2">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">Withdraw Payout</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Fast Cashout</span>
          </button>

          <button
            onClick={() => setActiveTab('invite')}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-950/20 text-slate-200 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform mb-2">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">Invite & Earn</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Up to 10% Commission</span>
          </button>
        </div>
      </div>

      {/* Detailed Platform Highlights & Info */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-white">Why Lease Servers on Sun Belt Inc?</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Sun Belt Inc operates high-throughput cloud compute nodes and GPU clusters. By leasing server capacity, you earn automated daily compute yields.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/60 border border-slate-800/80 p-5 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Automated Daily Returns</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yield is calculated continuously per second and can be claimed anytime directly into your Sun Belt Inc wallet balance.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 p-5 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Secure Local Payouts</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant cashouts to GCash, PayMaya, and major Philippine banks with encrypted transaction ledger security.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 p-5 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Generous Referral Rewards</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Earn 10% direct commission when your friends lease a server, plus 3% tier 2 and 1% tier 3 team commissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
