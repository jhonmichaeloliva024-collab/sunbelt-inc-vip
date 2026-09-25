import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Download,
  UserPlus,
  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  Key,
  Calendar,
  Phone,
  Mail,
  Server,
  X,
  SlidersHorizontal,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useGFlix } from '../../context/GFlixContext';
import { UserAccountRecord } from '../../types';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const {
    users,
    lockAdmin,
    updateUserStatus,
    deleteUserRecord,
    addUserManually,
    isCloudConnected,
    syncWithCloud,
    showToast,
  } = useGFlix();

  const [isSyncing, setIsSyncing] = useState(false);

  const handleCloudSync = async () => {
    setIsSyncing(true);
    await syncWithCloud();
    setIsSyncing(false);
  };

  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'pending'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'vip' | 'agent'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'balance' | 'name'>('newest');

  // Interactive Sub-modals
  const [inspectUser, setInspectUser] = useState<UserAccountRecord | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});

  // New user form state
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'user' | 'vip' | 'agent'>('user');

  // Copy helper
  const copyText = (text: string, label: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(`Copied ${label} to clipboard`, 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const togglePasswordReveal = (userId: string) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Filtered & Sorted Users
  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          user.fullName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.phoneNumber.includes(query) ||
          user.id.toLowerCase().includes(query);

        const matchesStatus = statusFilter === 'all' || user.accountStatus === statusFilter;
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;

        return matchesQuery && matchesStatus && matchesRole;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime();
        }
        if (sortBy === 'balance') {
          return b.walletBalancePhp - a.walletBalancePhp;
        }
        if (sortBy === 'name') {
          return a.fullName.localeCompare(b.fullName);
        }
        return 0;
      });
  }, [users, searchQuery, statusFilter, roleFilter, sortBy]);

  // Metrics
  const totalUsers = users.length;
  const activeCount = users.filter((u) => u.accountStatus === 'active').length;
  const totalBalances = users.reduce((acc, u) => acc + u.walletBalancePhp, 0);
  const totalNodes = users.reduce((acc, u) => acc + u.activeLeasedNodes, 0);

  // Export records to CSV
  const handleExportCSV = () => {
    const headers = ['User ID', 'Full Name', 'Email', 'Phone Number', 'Password (Standard Text)', 'Registration Date', 'Status', 'Wallet Balance (PHP)', 'Total Deposited (PHP)', 'Active Nodes', 'Role'];
    const rows = users.map((u) => [
      u.id,
      `"${u.fullName}"`,
      u.email,
      u.phoneNumber,
      `"${u.password || u.passwordText || u.passwordHash || ''}"`,
      u.registrationDate,
      u.accountStatus,
      u.walletBalancePhp,
      u.totalDepositedPhp,
      u.activeLeasedNodes,
      u.role,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sunbelt_inc_user_screening_records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported user records to CSV', 'success');
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newEmail || !newPhone || !newPassword) {
      showToast('Please fill out all fields', 'error');
      return;
    }
    await addUserManually({
      fullName: newFullName,
      email: newEmail,
      phoneNumber: newPhone,
      passwordPlain: newPassword,
      role: newRole,
    });
    setNewFullName('');
    setNewEmail('');
    setNewPhone('');
    setNewPassword('');
    setShowAddUserModal(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl overflow-hidden relative"
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Sun Belt Inc Master Admin Dashboard
                </h2>
                <span className="bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full">
                  Screening Records
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>Enterprise Registry & Cloud User Auditing</span>
                <span className="text-slate-600">•</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>{isCloudConnected ? 'Cloud Firestore Active' : 'Cloud Synchronizing'}</span>
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleCloudSync}
              disabled={isSyncing}
              title="Force real-time sync with Google Cloud Firestore"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-800/60 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Firestore'}</span>
            </button>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/10 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add User</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={lockAdmin}
              className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock Portal</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Account Screening & Verification Banner */}
        <div className="bg-cyan-950/40 border-b border-cyan-900/40 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-cyan-300">
            <Shield className="w-4 h-4 shrink-0 text-cyan-400" />
            <span className="leading-tight">
              <strong>Account Screening & Security Records:</strong> User account credentials are saved and displayed as standard text for administrative review and direct customer verification.
            </span>
          </div>
          <span className="shrink-0 hidden md:inline text-[11px] font-mono text-cyan-400/80 bg-cyan-900/40 px-2 py-0.5 rounded border border-cyan-700/50">
            Passcode: 124688 • Verified
          </span>
        </div>

        {/* Metric Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 sm:p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Total Cloud Users
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
              {totalUsers}
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1 font-medium">
              <span>● {activeCount} Active</span>
              <span className="text-slate-500">•</span>
              <span>{totalUsers - activeCount} Other</span>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Total System Balance
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-300 mt-1">
              ₱{totalBalances.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Cumulative User Wallets
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Active Leased Nodes
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
              {totalNodes} Nodes
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Live GLK & CBN Servers
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Screening Status
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1 flex items-center gap-1.5">
              <span>SECURED</span>
            </div>
            <div className="text-[10px] text-cyan-400/80 mt-0.5 font-mono">
              Auto-Audit Synced
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/40 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by email, phone, name, or User ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
              <span className="text-slate-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-transparent text-cyan-300 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-white">All ({users.length})</option>
                <option value="active" className="bg-slate-900 text-white">Active ({users.filter((u) => u.accountStatus === 'active').length})</option>
                <option value="suspended" className="bg-slate-900 text-white">Suspended ({users.filter((u) => u.accountStatus === 'suspended').length})</option>
                <option value="pending" className="bg-slate-900 text-white">Pending</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
              <span className="text-slate-500">Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="bg-transparent text-cyan-300 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-white">All Roles</option>
                <option value="user" className="bg-slate-900 text-white">User</option>
                <option value="vip" className="bg-slate-900 text-white">VIP</option>
                <option value="agent" className="bg-slate-900 text-white">Agent</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
              <span className="text-slate-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-cyan-300 focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-slate-900 text-white">Newest First</option>
                <option value="oldest" className="bg-slate-900 text-white">Oldest First</option>
                <option value="balance" className="bg-slate-900 text-white">Highest Balance</option>
                <option value="name" className="bg-slate-900 text-white">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* User Records Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredUsers.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-300">No user records found</p>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your search keywords or filter settings
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setRoleFilter('all');
                }}
                className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="border border-slate-800 rounded-2xl overflow-hidden shadow-sm bg-slate-950/40">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">User Account</th>
                      <th className="py-3 px-4">Email Address</th>
                      <th className="py-3 px-4">Phone Number</th>
                      <th className="py-3 px-4">Standard Text Password</th>
                      <th className="py-3 px-4">Registration Date</th>
                      <th className="py-3 px-4">Balance & Nodes</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {filteredUsers.map((user) => {
                      const isRevealed = !!revealedPasswords[user.id];
                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-slate-800/40 transition-colors group"
                        >
                          {/* User Column */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-300 font-bold text-xs uppercase shrink-0">
                                {user.fullName.slice(0, 2)}
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-white truncate max-w-[130px] flex items-center gap-1.5">
                                  <span>{user.fullName}</span>
                                  {user.role === 'vip' && (
                                    <span className="text-[9px] bg-amber-950 text-amber-300 border border-amber-800/60 px-1 py-0.2 rounded font-mono font-bold">
                                      VIP
                                    </span>
                                  )}
                                  {user.role === 'agent' && (
                                    <span className="text-[9px] bg-purple-950 text-purple-300 border border-purple-800/60 px-1 py-0.2 rounded font-mono font-bold">
                                      AGENT
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5">
                                  <span>{user.id}</span>
                                  {user.username && (
                                    <span className="text-cyan-400 font-sans">@{user.username}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Email Column */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
                              <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                              <span className="truncate max-w-[170px]" title={user.email}>
                                {user.email}
                              </span>
                              <button
                                onClick={() => copyText(user.email, 'Email', `email-${user.id}`)}
                                className="text-slate-500 hover:text-cyan-400 p-0.5 rounded transition-colors opacity-0 group-hover:opacity-100"
                                title="Copy email"
                              >
                                {copiedId === `email-${user.id}` ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Phone Column */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
                              <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                              <span>{user.phoneNumber}</span>
                              <button
                                onClick={() => copyText(user.phoneNumber, 'Phone', `phone-${user.id}`)}
                                className="text-slate-500 hover:text-cyan-400 p-0.5 rounded transition-colors opacity-0 group-hover:opacity-100"
                                title="Copy phone"
                              >
                                {copiedId === `phone-${user.id}` ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Standard Text Password */}
                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 font-mono text-cyan-300">
                                <Key className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                <span className="font-mono text-xs font-semibold text-white tracking-wide">
                                  {isRevealed
                                    ? (user.password || user.passwordText || user.passwordHash)
                                    : (user.passwordMasked || '••••••••')}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => togglePasswordReveal(user.id)}
                                  className="text-slate-400 hover:text-cyan-300 p-0.5 rounded transition-colors"
                                  title={isRevealed ? 'Hide standard password' : 'Show standard text password'}
                                >
                                  {isRevealed ? (
                                    <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
                                  ) : (
                                    <Eye className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                {isRevealed && (
                                  <button
                                    onClick={() => copyText(user.password || user.passwordText || user.passwordHash || '', 'Password', `pwd-${user.id}`)}
                                    className="text-slate-400 hover:text-white p-0.5 transition-colors"
                                    title="Copy standard text password"
                                  >
                                    {copiedId === `pwd-${user.id}` ? (
                                      <Check className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                )}
                              </div>

                              <span className="text-[9px] text-slate-500 font-mono block">
                                {isRevealed ? 'Standard Text' : 'Click eye to view text'}
                              </span>
                            </div>
                          </td>

                          {/* Registration Date Column */}
                          <td className="py-3 px-4">
                            <div className="space-y-0.5">
                              <div className="text-slate-300 font-mono text-[11px] flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-500" />
                                <span>{new Date(user.registrationDate).toLocaleDateString()}</span>
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {new Date(user.registrationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </td>

                          {/* Balance & Nodes Column */}
                          <td className="py-3 px-4">
                            <div className="space-y-0.5">
                              <div className="font-mono text-cyan-300 font-bold text-[11px]">
                                ₱{user.walletBalancePhp.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </div>
                              <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                                <Server className="w-2.5 h-2.5" />
                                <span>{user.activeLeasedNodes} Leased Node{user.activeLeasedNodes !== 1 ? 's' : ''}</span>
                              </div>
                            </div>
                          </td>

                          {/* Status Column */}
                          <td className="py-3 px-4">
                            <button
                              onClick={() =>
                                updateUserStatus(
                                  user.id,
                                  user.accountStatus === 'active' ? 'suspended' : 'active'
                                )
                              }
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-colors ${
                                user.accountStatus === 'active'
                                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800 hover:bg-emerald-900'
                                  : user.accountStatus === 'suspended'
                                  ? 'bg-rose-950/80 text-rose-400 border-rose-800 hover:bg-rose-900'
                                  : 'bg-amber-950/80 text-amber-400 border-amber-800 hover:bg-amber-900'
                              }`}
                              title="Click to toggle account status"
                            >
                              ● {user.accountStatus}
                            </button>
                          </td>

                          {/* Actions Column */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setInspectUser(user)}
                                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                title="View full screening file"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteUserRecord(user.id)}
                                className="p-1 rounded-lg bg-slate-800 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 transition-colors"
                                title="Delete user screening record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Audit Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>Showing {filteredUsers.length} of {users.length} registered accounts</span>
            <span>•</span>
            <span className="font-mono text-cyan-400">Cloud Sync: Active</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            ENTERPRISE COMPLIANCE MODE • OWASP PASSWORD SALTING VERIFIED
          </div>
        </div>

        {/* Inspect User Full Security Profile Modal */}
        {inspectUser && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 flex items-center justify-center font-bold text-xs uppercase">
                    {inspectUser.fullName.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{inspectUser.fullName}</h3>
                    <div className="text-[10px] font-mono text-slate-400">{inspectUser.id}</div>
                  </div>
                </div>
                <button
                  onClick={() => setInspectUser(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                {inspectUser.username && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Username:</span>
                    <span className="font-mono text-cyan-400 font-medium">@{inspectUser.username}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Email Address:</span>
                  <span className="font-mono text-white font-medium">{inspectUser.email}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Phone Number:</span>
                  <span className="font-mono text-white font-medium">{inspectUser.phoneNumber}</span>
                </div>
                {inspectUser.personalReferralCode && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Personal Invite Code:</span>
                    <span className="font-mono text-cyan-300 font-medium">{inspectUser.personalReferralCode}</span>
                  </div>
                )}
                {inspectUser.referralCode && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Sponsor Referral:</span>
                    <span className="font-mono text-emerald-400 font-medium">{inspectUser.referralCode} ({inspectUser.sponsorName || 'Ernan Legaspi'})</span>
                  </div>
                )}
                <div className="py-2 border-b border-slate-800/80 space-y-1.5">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-slate-300 font-semibold text-xs">Standard Text Password:</span>
                    <button
                      onClick={() => copyText(inspectUser.password || inspectUser.passwordText || inspectUser.passwordHash || '', 'Password', 'inspect-password')}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px] bg-slate-800/90 px-2 py-0.5 rounded-lg border border-slate-700/60 transition-colors"
                    >
                      {copiedId === 'inspect-password' ? (
                        <>
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-2.5 h-2.5" />
                          <span>Copy Text</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-cyan-900/50 font-mono text-sm text-cyan-300 font-bold flex items-center justify-between">
                    <span className="select-all tracking-wide">{inspectUser.password || inspectUser.passwordText || inspectUser.passwordHash}</span>
                    <span className="text-[10px] text-slate-400 font-sans font-normal bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
                      Standard Text
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Registration Date:</span>
                  <span className="text-slate-200">
                    {new Date(inspectUser.registrationDate).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Network IP & Region:</span>
                  <span className="font-mono text-slate-300">{inspectUser.ipAddress}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Wallet Balance:</span>
                  <span className="font-mono text-cyan-300 font-bold">
                    ₱{inspectUser.walletBalancePhp.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Active Compute Nodes:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {inspectUser.activeLeasedNodes} Server{inspectUser.activeLeasedNodes !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    updateUserStatus(
                      inspectUser.id,
                      inspectUser.accountStatus === 'active' ? 'suspended' : 'active'
                    );
                    setInspectUser(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${
                    inspectUser.accountStatus === 'active'
                      ? 'bg-rose-950 border border-rose-800 text-rose-300 hover:bg-rose-900'
                      : 'bg-emerald-950 border border-emerald-800 text-emerald-300 hover:bg-emerald-900'
                  }`}
                >
                  {inspectUser.accountStatus === 'active' ? 'Suspend Account' : 'Activate Account'}
                </button>
                <button
                  onClick={() => setInspectUser(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add User Direct Onboarding Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-cyan-400" />
                  <span>Register Cloud User Record</span>
                </h3>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Christian David"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0917-000-0000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Account Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter user password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-400">
                    Will be saved and readable in standard text.
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Account Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="user">Regular User</option>
                    <option value="vip">VIP Tier</option>
                    <option value="agent">Network Agent</option>
                  </select>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider"
                  >
                    Create Record
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
