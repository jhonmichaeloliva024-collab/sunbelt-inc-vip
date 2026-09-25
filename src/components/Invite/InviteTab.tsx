import React, { useState } from 'react';
import { useGFlix } from '../../context/GFlixContext';
import {
  Copy,
  Check,
  Share2,
  UserPlus,
  QrCode,
  Sparkles,
  ExternalLink,
  Send,
  CheckCircle2,
} from 'lucide-react';

export const InviteTab: React.FC = () => {
  const { wallet, showToast, applyReferralCode } = useGFlix();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(wallet.referralCode);
    setCopiedCode(true);
    showToast(`Referral code ${wallet.referralCode} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(wallet.referralLink);
    setCopiedLink(true);
    showToast('Functioning invitation link copied to clipboard! Ready to share.', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Sun Belt Inc - Server Leasing Invitation',
          text: `Join Sun Belt Inc using my referral code ${wallet.referralCode} and claim your ₱30 Welcome Bonus!`,
          url: wallet.referralLink,
        });
      } catch {
        // User dismissed share sheet
      }
    } else {
      handleCopyLink();
    }
  };

  const handleTestLinkFlow = () => {
    applyReferralCode(wallet.referralCode);
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* Invite Hero Card */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950/80 border border-indigo-800/40 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sun Belt Inc Referral Partner Program</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Invite Friends & Earn Up To{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent">
                10% Commission
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Share your personal referral link with friends. When they register, they receive a <strong className="text-emerald-400">₱30.00 Welcome Bonus</strong>, and you earn continuous cash commissions whenever they lease servers!
            </p>
          </div>

          <div className="bg-slate-950/80 border border-indigo-800/50 rounded-2xl p-4 text-center min-w-[200px] w-full md:w-auto">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Referral Earnings</div>
            <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">
              ₱{wallet.referralEarningsPhp.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-cyan-400 mt-1 font-semibold flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Directly Cashable to Wallet</span>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Code & Link Share Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Share2 className="w-4 h-4 text-cyan-400" /> Your Active Referral Gateway
          </h3>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-[11px] text-emerald-300 font-semibold self-start sm:self-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live & Functional Gateway</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Referral Code Box */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
            <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
              <span>Your Referral Code</span>
              <span className="text-[11px] text-emerald-400 font-mono">10% Direct Yield</span>
            </div>
            <div className="flex items-center justify-between gap-2 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl">
              <span className="font-mono text-lg font-bold text-cyan-300 tracking-wider">
                {wallet.referralCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          {/* Referral Link Box */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
            <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
              <span>Your Invitation Link (Functioning & Live)</span>
              <span className="text-[11px] text-cyan-400">Auto-applies ₱30 Bonus</span>
            </div>
            <div className="flex items-center justify-between gap-2 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl">
              <span className="font-mono text-xs text-slate-300 truncate select-all" title={wallet.referralLink}>
                {wallet.referralLink}
              </span>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Action Tools: Test Link, Share, QR Code */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTestLinkFlow}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-colors cursor-pointer"
              title="Test how your invitation link works when someone opens it"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Test Invitation Flow</span>
            </button>

            <button
              onClick={handleNativeShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Share Link</span>
            </button>

            {/* Quick Share Links */}
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(wallet.referralLink)}&text=${encodeURIComponent(`Join Sun Belt Inc with my invite code ${wallet.referralCode} and claim a ₱30 Welcome Bonus!`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-xl bg-sky-950/60 hover:bg-sky-900/80 text-sky-400 text-xs font-medium border border-sky-800/50 transition-colors"
            >
              Telegram
            </a>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Join Sun Belt Inc using my referral code ${wallet.referralCode} and receive a ₱30 Welcome Bonus! ${wallet.referralLink}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 text-xs font-medium border border-emerald-800/50 transition-colors"
            >
              WhatsApp
            </a>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(wallet.referralLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 text-blue-400 text-xs font-medium border border-blue-800/50 transition-colors"
            >
              Facebook
            </a>
          </div>

          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
          >
            <QrCode className="w-4 h-4" /> View QR Code
          </button>
        </div>

        {/* Verification Note */}
        <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-2xl flex items-start sm:items-center gap-2.5 text-xs text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            Anyone who visits your invitation link is automatically routed to Sun Belt Inc with referral code <strong className="text-cyan-300 font-mono">{wallet.referralCode}</strong> pre-filled, guaranteeing they receive the <strong>₱30.00 Welcome Bonus</strong>.
          </span>
        </div>
      </div>

      {/* Commission Structure & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tier 1 Direct */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-950 border border-cyan-800 px-2.5 py-0.5 rounded-full">
              Tier 1 Direct
            </span>
            <span className="text-2xl font-black font-mono text-cyan-400">10%</span>
          </div>
          <h4 className="font-bold text-white text-sm">Direct Referral Reward</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Earn 10% instant commission whenever your direct invite purchases or leases any server package.
          </p>
        </div>

        {/* Tier 2 Secondary */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 bg-indigo-950 border border-indigo-800 px-2.5 py-0.5 rounded-full">
              Tier 2 Secondary
            </span>
            <span className="text-2xl font-black font-mono text-indigo-400">3%</span>
          </div>
          <h4 className="font-bold text-white text-sm">Sub-Team Commission</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Earn 3% commission on server leases made by users invited by your direct referrals.
          </p>
        </div>

        {/* Tier 3 Team */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded-full">
              Tier 3 Team
            </span>
            <span className="text-2xl font-black font-mono text-emerald-400">1%</span>
          </div>
          <h4 className="font-bold text-white text-sm">Level 3 Team Bonus</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Earn 1% additional commission across extended level 3 server lease activities.
          </p>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 text-center">
            <h3 className="text-lg font-bold text-white">Your Referral QR Code</h3>
            <p className="text-xs text-slate-400">Scan to join Sun Belt Inc server leasing under your team.</p>

            <div className="bg-white p-4 rounded-2xl max-w-[200px] mx-auto shadow-xl">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  wallet.referralLink
                )}`}
                alt="Referral QR Code"
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </div>

            <p className="text-xs font-mono text-cyan-300 font-bold bg-slate-950 p-2 rounded-xl border border-slate-800">
              {wallet.referralCode}
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
