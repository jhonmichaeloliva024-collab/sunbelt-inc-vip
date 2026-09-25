import React, { useState } from 'react';
import { useGFlix } from '../../context/GFlixContext';
import { TransactionType, WalletTransaction } from '../../types';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  PlusCircle,
  Coins,
  History,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  QrCode,
  CreditCard,
  Building2,
  Phone,
  Info,
  Copy,
  AlertCircle,
  TrendingUp,
  X,
  Server,
  Gift,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminPinModal } from '../Admin/AdminPinModal';

export const WalletTab: React.FC = () => {
  const {
    wallet,
    transactions,
    depositFunds,
    withdrawFunds,
    showToast,
    isAdminUnlocked,
    openAdminDashboard,
  } = useGFlix();

  // Modals state
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [selectedTxDetail, setSelectedTxDetail] = useState<WalletTransaction | null>(null);

  // Balance Record Filter & Search State
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Deposit Form State
  const [depositMethod, setDepositMethod] = useState<'GCash' | 'PayMaya' | 'Bank'>('GCash');
  const [depositAmount, setDepositAmount] = useState<number>(700);
  const [customDepositAmount, setCustomDepositAmount] = useState<string>('700');
  const [depositRefNumber, setDepositRefNumber] = useState<string>('');

  // Withdrawal Form State
  const [withdrawMethod, setWithdrawMethod] = useState<'GCash' | 'PayMaya' | 'Bank'>('GCash');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('500');
  const [withdrawAccNumber, setWithdrawAccNumber] = useState<string>('');
  const [withdrawAccName, setWithdrawAccName] = useState<string>('');

  // Preset Deposit amounts
  const presetAmounts = [250, 700, 1500, 5000, 10000];

  // Filter Transactions for Balance Record
  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'deposit' && tx.type === 'deposit') ||
      (filterType === 'withdrawal' && tx.type === 'withdrawal') ||
      (filterType === 'lease' && tx.type === 'lease_purchase') ||
      (filterType === 'yield' && tx.type === 'server_yield') ||
      (filterType === 'referral' && tx.type === 'referral_bonus');

    const matchesSearch =
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.refNumber && tx.refNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tx.method && tx.method.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(customDepositAmount);
    if (isNaN(amount) || amount < 100) {
      showToast('Minimum deposit is ₱100.00', 'error');
      return;
    }
    const success = depositFunds(amount, depositMethod, depositRefNumber);
    if (success) {
      setShowDepositModal(false);
      setDepositRefNumber('');
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (isNaN(amount) || amount < 100) {
      showToast('Minimum withdrawal amount is ₱100.00', 'error');
      return;
    }
    const res = withdrawFunds(amount, withdrawMethod, withdrawAccNumber, withdrawAccName);
    if (res.success) {
      setShowWithdrawModal(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard`, 'success');
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* Service Maintenance Notice Banner */}
      <div className="bg-amber-950/40 border border-amber-800/60 rounded-2xl p-4 flex items-start sm:items-center gap-3 text-amber-300 shadow-md">
        <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5 sm:mt-0" />
        <div className="text-xs sm:text-sm">
          <span className="font-bold text-amber-200">System Notice:</span> The <strong>Deposit</strong> and <strong>Withdrawal</strong> functions are not available at the moment due to scheduled payment gateway system upgrades.
        </div>
      </div>

      {/* Wallet Balance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Main Available Balance Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/80 border border-emerald-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Available Balance</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>

          <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 my-2">
            ₱{wallet.balancePhp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

          <p className="text-xs text-slate-300">
            Available for server leasing or instant cash withdrawals.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-5">
            <button
              onClick={() => setShowDepositModal(true)}
              className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 text-slate-300 border border-slate-700/80 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <ArrowDownLeft className="w-4 h-4 text-amber-400" />
              <span>Deposit</span>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono font-normal">
                Not Available
              </span>
            </button>

            <button
              onClick={() => setShowWithdrawModal(true)}
              className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 text-slate-300 border border-slate-700/80 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
              <span>Withdraw</span>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono font-normal">
                Not Available
              </span>
            </button>
          </div>
        </div>

        {/* Total Earned Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Total Compute Earned</span>
            <Coins className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300">
            ₱{wallet.totalEarnedPhp.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400">Cumulative server returns claimed</p>
        </div>

        {/* Deposited & Withdrawn Summary */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3">
          <div className="space-y-1 border-b border-slate-800 pb-2">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Deposited</div>
            <div className="text-base font-bold font-mono text-slate-200">
              ₱{wallet.totalDepositedPhp.toLocaleString('en-US')}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Withdrawn</div>
            <div className="text-base font-bold font-mono text-cyan-400">
              ₱{wallet.totalWithdrawnPhp.toLocaleString('en-US')}
            </div>
          </div>
        </div>
      </div>

      {/* Balance Record System (Transaction Ledger) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-cyan-400" /> Balance Records & Ledger
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Complete transaction history for deposits, withdrawals, server leases, and returns.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search TX ID or method..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Transaction Type Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Records' },
            { id: 'deposit', label: 'Deposits' },
            { id: 'withdrawal', label: 'Withdrawals' },
            { id: 'lease', label: 'Lease Purchases' },
            { id: 'yield', label: 'Server Yields' },
            { id: 'referral', label: 'Referrals' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                filterType === tab.id
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Balance Records Table / List */}
        <div className="divide-y divide-slate-800/80 min-h-[240px]">
          {filteredTransactions.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No transaction records found matching your current filter criteria.
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const isPositive =
                tx.type === 'deposit' || tx.type === 'server_yield' || tx.type === 'referral_bonus';
              const dateStr = new Date(tx.timestamp).toLocaleString();

              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTxDetail(tx)}
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-800/40 px-2 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        tx.type === 'deposit'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : tx.type === 'withdrawal'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          : tx.type === 'lease_purchase'
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                          : tx.type === 'server_yield'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                      }`}
                    >
                      {tx.type === 'deposit' && <ArrowDownLeft className="w-5 h-5" />}
                      {tx.type === 'withdrawal' && <ArrowUpRight className="w-5 h-5" />}
                      {tx.type === 'lease_purchase' && <Server className="w-5 h-5" />}
                      {tx.type === 'server_yield' && <Coins className="w-5 h-5" />}
                      {tx.type === 'referral_bonus' && <Gift className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <span>{tx.description}</span>
                        <span className="text-[10px] font-mono text-slate-500">#{tx.id}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>{dateStr}</span>
                        {tx.method && (
                          <span className="bg-slate-950 border border-slate-800 px-1.5 py-0.2 rounded text-[10px]">
                            {tx.method}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`font-mono font-bold text-sm ${
                        isPositive ? 'text-emerald-400' : 'text-slate-200'
                      }`}
                    >
                      {isPositive ? '+' : '-'}₱{tx.amountPhp.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] font-semibold text-emerald-400 flex items-center justify-end gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Deposit Modal */}
      <AnimatePresence>
        {showDepositModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ArrowDownLeft className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Deposit Funds</h3>
                    <p className="text-xs text-slate-400">GCash, PayMaya or Bank Transfer</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Service Maintenance Notice */}
              <div className="bg-amber-950/50 border border-amber-800/80 rounded-2xl p-4 flex items-start gap-3 text-amber-300 text-xs">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <strong className="block text-amber-200 text-sm font-bold mb-0.5">
                    Deposit Function Not Available
                  </strong>
                  The deposit service is temporarily not available at the moment due to scheduled payment gateway system upgrades. New deposit submissions are currently paused.
                </div>
              </div>

              <form onSubmit={handleDepositSubmit} className="space-y-4 opacity-70 pointer-events-none">
                {/* Deposit Method Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Choose Deposit Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'GCash', label: 'GCash', color: 'bg-blue-600' },
                      { id: 'PayMaya', label: 'PayMaya', color: 'bg-emerald-600' },
                      { id: 'Bank', label: 'Bank', color: 'bg-indigo-600' },
                    ].map((m) => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setDepositMethod(m.id as any)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                          depositMethod === m.id
                            ? 'bg-slate-800 border-cyan-400 text-cyan-300 shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Select or Enter Amount (₱)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {presetAmounts.map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => {
                          setDepositAmount(amt);
                          setCustomDepositAmount(amt.toString());
                        }}
                        className={`py-2 rounded-xl text-xs font-mono font-bold border transition-colors ${
                          Number(customDepositAmount) === amt
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        ₱{amt.toLocaleString('en-US')}
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    min="100"
                    placeholder="Enter custom deposit amount"
                    value={customDepositAmount}
                    onChange={(e) => setCustomDepositAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Payment Receiver Info Details & QR */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                    <span>Send Payment To:</span>
                    <span className="text-[10px] bg-cyan-950 border border-cyan-800 px-2 py-0.5 rounded text-cyan-300">
                      {depositMethod} Verified
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 bg-slate-900 p-3 rounded-xl">
                    <div className="text-xs space-y-1">
                      <div className="text-slate-400">Account Name: <strong className="text-white">Sun Belt Inc Treasury PH</strong></div>
                      <div className="text-slate-400">
                        Account No:{' '}
                        <strong className="text-cyan-300 font-mono">
                          {depositMethod === 'Bank' ? '1092-8812-9001 (BDO)' : '0917-882-9102'}
                        </strong>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          depositMethod === 'Bank' ? '109288129001' : '09178829102',
                          'Account Number'
                        )
                      }
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  {/* QR Code Placeholder for scanning */}
                  <div className="bg-white p-3 rounded-xl max-w-[140px] mx-auto text-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=SUNBELT_PAYMENT_${depositMethod}_${customDepositAmount}`}
                      alt="Sun Belt Inc Deposit QR"
                      className="w-full h-auto"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Reference Number Input */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Payment Reference / Ref Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 900218491823"
                    value={depositRefNumber}
                    onChange={(e) => setDepositRefNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                  <p className="text-[10px] text-slate-400">
                    Enter the Reference No. from your GCash/PayMaya receipt.
                  </p>
                </div>

                <div className="pt-2 pointer-events-auto">
                  <button
                    type="button"
                    disabled={true}
                    className="w-full py-3 rounded-2xl bg-slate-800 text-slate-500 font-bold text-xs uppercase tracking-wider border border-slate-700 cursor-not-allowed"
                  >
                    Deposit Function Not Available
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
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
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Withdrawal System</h3>
                    <p className="text-xs text-slate-400">Fast Local Cashout</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Service Maintenance Notice */}
              <div className="bg-amber-950/50 border border-amber-800/80 rounded-2xl p-4 flex items-start gap-3 text-amber-300 text-xs">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <strong className="block text-amber-200 text-sm font-bold mb-0.5">
                    Withdrawal Function Not Available
                  </strong>
                  The withdrawal service is temporarily not available at the moment due to scheduled banking channel maintenance. Payout processing is currently paused.
                </div>
              </div>

              <form onSubmit={handleWithdrawSubmit} className="space-y-4 opacity-70 pointer-events-none">
                {/* Method Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Payout Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['GCash', 'PayMaya', 'Bank'].map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setWithdrawMethod(m as any)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                          withdrawMethod === m
                            ? 'bg-slate-800 border-cyan-400 text-cyan-300 shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Account Name & Number */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Account Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name on GCash/Bank"
                      value={withdrawAccName}
                      onChange={(e) => setWithdrawAccName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Account Number / Mobile No. *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={withdrawMethod === 'Bank' ? 'Bank Account Number' : '0917XXXXXXX'}
                      value={withdrawAccNumber}
                      onChange={(e) => setWithdrawAccNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Withdrawal Amount (PHP) *
                    </label>
                    <input
                      type="number"
                      min="100"
                      required
                      placeholder="Minimum ₱100.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Calculation Summary */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Available Balance:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      ₱{wallet.balancePhp.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Requested Amount:</span>
                    <span className="font-mono text-white">
                      ₱{Number(withdrawAmount || 0).toLocaleString('en-US')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Processing Fee (5%):</span>
                    <span className="font-mono text-rose-400">
                      -₱{(Number(withdrawAmount || 0) * 0.05).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-white font-bold pt-2 border-t border-slate-800 text-sm">
                    <span>Net Payout Received:</span>
                    <span className="font-mono text-cyan-300">
                      ₱{(Number(withdrawAmount || 0) * 0.95).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 pointer-events-auto">
                  <button
                    type="button"
                    disabled={true}
                    className="w-full py-3 rounded-2xl bg-slate-800 text-slate-500 font-bold text-xs uppercase tracking-wider border border-slate-700 cursor-not-allowed"
                  >
                    Withdrawal Function Not Available
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transaction Detail Drawer */}
      <AnimatePresence>
        {selectedTxDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Transaction Receipt</h3>
                <button
                  onClick={() => setSelectedTxDetail(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center py-2 space-y-1">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  {selectedTxDetail.type.replace('_', ' ')}
                </div>
                <div className="text-3xl font-extrabold font-mono text-cyan-300">
                  ₱{selectedTxDetail.amountPhp.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="inline-block bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full mt-1">
                  ● {selectedTxDetail.status}
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Transaction ID:</span>
                  <span className="font-mono text-slate-200 font-bold">{selectedTxDetail.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date & Time:</span>
                  <span className="text-slate-200">{new Date(selectedTxDetail.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Description:</span>
                  <span className="text-slate-200 font-medium text-right max-w-[180px] truncate">
                    {selectedTxDetail.description}
                  </span>
                </div>
                {selectedTxDetail.method && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Method:</span>
                    <span className="text-cyan-300 font-bold">{selectedTxDetail.method}</span>
                  </div>
                )}
                {selectedTxDetail.refNumber && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reference No:</span>
                    <span className="font-mono text-emerald-400">{selectedTxDetail.refNumber}</span>
                  </div>
                )}
                {selectedTxDetail.feePhp && selectedTxDetail.feePhp > 0 && (
                  <div className="flex justify-between pt-2 border-t border-slate-800">
                    <span className="text-slate-400">Fee Deducted:</span>
                    <span className="font-mono text-rose-400">-₱{selectedTxDetail.feePhp.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedTxDetail(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Discreet Bottom Screening Access with 'x' Symbol Trigger */}
      <div className="pt-10 pb-6 flex flex-col items-center justify-center space-y-1.5 text-center select-none opacity-60 hover:opacity-100 transition-opacity">
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-mono tracking-wider">
          <span>SUN BELT INC PLATFORM</span>
          <span>•</span>
          <span>ENTERPRISE LEASING</span>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              if (isAdminUnlocked) {
                openAdminDashboard();
              } else {
                setShowPinModal(true);
              }
            }}
            title="Screening Gateway Access"
            className="w-5 h-5 inline-flex items-center justify-center rounded text-slate-500 hover:text-cyan-400 hover:bg-slate-800 transition-colors font-mono font-bold cursor-pointer"
          >
            x
          </button>
        </div>
        <p className="text-[10px] text-slate-600 font-mono">
          Encrypted Node Ledger • Enterprise Screening Protocol
        </p>
      </div>

      {/* Admin Security PIN Modal (Passcode: 124688) */}
      <AdminPinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={() => {
          setShowPinModal(false);
          openAdminDashboard();
        }}
      />
    </div>
  );
};
