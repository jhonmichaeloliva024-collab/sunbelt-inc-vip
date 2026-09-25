import React, { useState } from 'react';
import { useGFlix } from '../../context/GFlixContext';
import { SERVER_PACKAGES } from '../../data/serverPackages';
import { ServerPackage, ActiveLease } from '../../types';
import {
  Server,
  Zap,
  Clock,
  Coins,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  ChevronRight,
  ShieldCheck,
  Globe,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LeaseTab: React.FC = () => {
  const { wallet, activeLeases, leaseServer, claimYield, claimAllYields } = useGFlix();

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'glk' | 'cbn' | 'my_servers'>('all');
  const [modalPackage, setModalPackage] = useState<ServerPackage | null>(null);

  const activeServers = activeLeases.filter((l) => l.status === 'active');
  const totalDailyReturn = activeServers.reduce((acc, l) => acc + l.dailyReturnPhp, 0);
  const totalUnclaimedYield = activeServers.reduce((acc, l) => acc + l.unclaimedYieldPhp, 0);

  const filteredPackages = SERVER_PACKAGES.filter((pkg) => {
    if (selectedFilter === 'glk') return pkg.series === 'GLK';
    if (selectedFilter === 'cbn') return pkg.series === 'CBN';
    return true;
  });

  const handleConfirmLease = () => {
    if (!modalPackage) return;
    const success = leaseServer(modalPackage.id);
    if (success) {
      setModalPackage(null);
    }
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* Top Lease Overview Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sun Belt Inc Server Nodes</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Cloud Server Lease Catalog
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Select high-performance GLK or CBN server nodes to earn guaranteed daily compute yields.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-800">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Your Wallet</div>
              <div className="text-base font-bold font-mono text-emerald-400">
                ₱{wallet.balancePhp.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-800">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Daily Return</div>
              <div className="text-base font-bold font-mono text-cyan-400">
                ₱{totalDailyReturn.toFixed(2)}/day
              </div>
            </div>

            <button
              onClick={() => setSelectedFilter('my_servers')}
              className={`px-4 py-2.5 rounded-2xl font-semibold text-xs transition-all flex items-center gap-2 border ${
                selectedFilter === 'my_servers'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>My Servers ({activeServers.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs Header */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedFilter === 'all'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          All Server Packages ({SERVER_PACKAGES.length})
        </button>

        <button
          onClick={() => setSelectedFilter('glk')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            selectedFilter === 'glk'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          GLK Series (₱250)
        </button>

        <button
          onClick={() => setSelectedFilter('cbn')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            selectedFilter === 'cbn'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          CBN Series (₱700 - ₱5,000)
        </button>

        <button
          onClick={() => setSelectedFilter('my_servers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            selectedFilter === 'my_servers'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Active Leases ({activeServers.length})
        </button>
      </div>

      {/* Main Server Packages Grid OR My Active Servers */}
      {selectedFilter !== 'my_servers' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredPackages.map((pkg) => {
            const isAffordable = wallet.balancePhp >= pkg.pricePhp;
            const roiPct = Math.round(((pkg.totalReturnPhp - pkg.pricePhp) / pkg.pricePhp) * 100);

            return (
              <div
                key={pkg.id}
                className={`bg-slate-900/90 border rounded-3xl p-6 flex flex-col justify-between transition-all relative overflow-hidden group ${
                  pkg.popular
                    ? 'border-cyan-500/60 shadow-xl shadow-cyan-500/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Popular Badge */}
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-blue-600 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-bl-2xl flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3" /> {pkg.badge || 'Popular'}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Series Badge & Title */}
                  <div>
                    <span
                      className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-2 ${
                        pkg.series === 'GLK'
                          ? 'bg-blue-950/80 text-blue-300 border-blue-800'
                          : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                      }`}
                    >
                      {pkg.series} Series
                    </span>
                    <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {pkg.specs.cores} • {pkg.specs.location}
                    </p>
                  </div>

                  {/* Price Box */}
                  <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 text-center space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Lease Price</div>
                    <div className="text-3xl font-extrabold font-mono text-white">
                      ₱{pkg.pricePhp.toLocaleString('en-US')}
                    </div>
                    <div className="text-[11px] text-cyan-400 font-semibold pt-1">
                      {pkg.durationDays} Days Contract
                    </div>
                  </div>

                  {/* Returns & Yield Breakdown */}
                  <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" /> Daily Return:
                      </span>
                      <span className="font-bold font-mono text-emerald-400">
                        ₱{pkg.dailyReturnPhp}/day
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-yellow-400" /> Total Return:
                      </span>
                      <span className="font-bold font-mono text-white">
                        ₱{pkg.totalReturnPhp.toLocaleString('en-US')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Total Profit ROI:</span>
                      <span className="font-extrabold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                        +{roiPct}% ROI
                      </span>
                    </div>
                  </div>

                  {/* Hardware Specs list */}
                  <div className="bg-slate-950/40 rounded-xl p-3 text-[11px] space-y-1.5 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">RAM:</span>
                      <span className="font-medium">{pkg.specs.ram}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Bandwidth:</span>
                      <span className="font-medium">{pkg.specs.bandwidth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Hashrate:</span>
                      <span className="font-medium text-cyan-300">{pkg.specs.hashrate}</span>
                    </div>
                  </div>
                </div>

                {/* Lease Action Button */}
                <div className="pt-5">
                  <button
                    onClick={() => setModalPackage(pkg)}
                    className={`w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                      isAffordable
                        ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/20 active:scale-95'
                        : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    <Server className="w-4 h-4" />
                    <span>{isAffordable ? 'Lease Server Now' : 'Lease Server'}</span>
                  </button>
                  {!isAffordable && (
                    <p className="text-[10px] text-rose-400 text-center mt-1.5 font-medium">
                      Need ₱{(pkg.pricePhp - wallet.balancePhp).toLocaleString('en-US')} more in wallet
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* My Active Leases Section */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" /> Active Leased Servers ({activeServers.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Monitor live node status and claim accumulated daily compute returns.
              </p>
            </div>

            <button
              onClick={claimAllYields}
              disabled={totalUnclaimedYield <= 0}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                totalUnclaimedYield > 0
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-emerald-500/20 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Claim All Yields (₱{totalUnclaimedYield.toFixed(2)})</span>
            </button>
          </div>

          {activeLeases.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                <Server className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">No Active Servers Leased Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  You have not leased any server packages yet. Select Server GLK or CBN above to begin earning daily returns!
                </p>
              </div>
              <button
                onClick={() => setSelectedFilter('all')}
                className="bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-cyan-400 transition-colors"
              >
                Browse Server Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeLeases.map((lease) => {
                const startDate = new Date(lease.startDate).toLocaleDateString();
                const expiryDate = new Date(lease.expiryDate).toLocaleDateString();
                const progressPct = Math.min(
                  100,
                  Math.round((lease.totalClaimedPhp / lease.totalReturnPhp) * 100)
                );

                return (
                  <div
                    key={lease.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                          <Server className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base">{lease.packageName}</h4>
                          <span className="text-[11px] text-slate-400">Leased on {startDate}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                          lease.status === 'active'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {lease.status === 'active' ? '● Running Node' : 'Completed'}
                      </span>
                    </div>

                    {/* Node Load Visual Indicator */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Node Compute Load</span>
                        <span className="text-emerald-400 font-mono font-bold">98.4% Active</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                        <div className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full animate-pulse w-[98.4%]" />
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-500 uppercase">Daily Yield</div>
                        <div className="font-bold font-mono text-emerald-400 text-sm">
                          ₱{lease.dailyReturnPhp}/day
                        </div>
                      </div>

                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-500 uppercase">Contract Duration</div>
                        <div className="font-bold text-slate-200 text-sm">
                          {lease.durationDays} Days (Exp: {expiryDate})
                        </div>
                      </div>

                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-500 uppercase">Total Claimed</div>
                        <div className="font-bold font-mono text-slate-300 text-sm">
                          ₱{lease.totalClaimedPhp.toFixed(2)} / ₱{lease.totalReturnPhp}
                        </div>
                      </div>

                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-500 uppercase">Unclaimed Yield</div>
                        <div className="font-bold font-mono text-cyan-400 text-sm">
                          ₱{lease.unclaimedYieldPhp.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Claim Button */}
                    <button
                      onClick={() => claimYield(lease.id)}
                      disabled={lease.unclaimedYieldPhp <= 0 || lease.status !== 'active'}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                        lease.unclaimedYieldPhp > 0 && lease.status === 'active'
                          ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 active:scale-95'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>
                        {lease.unclaimedYieldPhp > 0
                          ? `Collect Yield (₱${lease.unclaimedYieldPhp.toFixed(2)})`
                          : 'Yield Accumulating...'}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {modalPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Lease Server Confirmation</h3>
                    <p className="text-xs text-slate-400">Sun Belt Inc Cloud Compute Node</p>
                  </div>
                </div>
                <button
                  onClick={() => setModalPackage(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-950 p-4 rounded-2xl space-y-2 border border-slate-800">
                  <div className="flex justify-between items-center text-sm font-bold text-white">
                    <span>Server Name:</span>
                    <span className="text-cyan-400">{modalPackage.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Series:</span>
                    <span className="text-slate-200 font-semibold">{modalPackage.series} Series</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Contract Duration:</span>
                    <span className="text-slate-200">{modalPackage.durationDays} Days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Daily Return:</span>
                    <span className="text-emerald-400 font-bold font-mono">₱{modalPackage.dailyReturnPhp}/day</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                    <span className="text-slate-300 font-bold">Total Expected Return:</span>
                    <span className="text-white font-extrabold font-mono text-sm">₱{modalPackage.totalReturnPhp.toLocaleString('en-US')}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl space-y-2 border border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Server Price:</span>
                    <span className="font-bold text-white font-mono text-sm">₱{modalPackage.pricePhp.toLocaleString('en-US')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Current Balance:</span>
                    <span className="font-bold text-emerald-400 font-mono">₱{wallet.balancePhp.toLocaleString('en-US')}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                    <span className="text-slate-400">Balance After Lease:</span>
                    <span
                      className={`font-bold font-mono ${
                        wallet.balancePhp >= modalPackage.pricePhp ? 'text-slate-200' : 'text-rose-400'
                      }`}
                    >
                      ₱{(wallet.balancePhp - modalPackage.pricePhp).toLocaleString('en-US')}
                    </span>
                  </div>
                </div>
              </div>

              {wallet.balancePhp < modalPackage.pricePhp && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    Insufficient balance. Please deposit funds or top-up demo balance first.
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setModalPackage(null)}
                  className="w-1/2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirmLease}
                  disabled={wallet.balancePhp < modalPackage.pricePhp}
                  className={`w-1/2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                    wallet.balancePhp >= modalPackage.pricePhp
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/20 active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Lease</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
