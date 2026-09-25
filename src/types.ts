export type PageTab = 'home' | 'lease' | 'invite' | 'wallet';

export interface ServerPackage {
  id: string;
  name: string;
  series: 'GLK' | 'CBN';
  pricePhp: number;
  dailyReturnPhp: number;
  durationDays: number;
  totalReturnPhp: number;
  badge?: string;
  specs: {
    cores: string;
    ram: string;
    bandwidth: string;
    location: string;
    hashrate: string;
  };
  popular?: boolean;
}

export interface ActiveLease {
  id: string;
  packageId: string;
  packageName: string;
  series: 'GLK' | 'CBN';
  pricePhp: number;
  dailyReturnPhp: number;
  durationDays: number;
  totalReturnPhp: number;
  startDate: string; // ISO string
  expiryDate: string; // ISO string
  lastClaimDate: string; // ISO string
  unclaimedYieldPhp: number;
  totalClaimedPhp: number;
  status: 'active' | 'completed';
}

export type TransactionType = 'deposit' | 'withdrawal' | 'lease_purchase' | 'server_yield' | 'referral_bonus';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface WalletTransaction {
  id: string;
  type: TransactionType;
  amountPhp: number;
  feePhp?: number;
  description: string;
  timestamp: string;
  status: TransactionStatus;
  method?: string;
  refNumber?: string;
}

export interface ReferralUser {
  id: string;
  name: string;
  phoneMasked: string;
  joinDate: string;
  tier: 1 | 2 | 3;
  totalInvestedPhp: number;
  commissionEarnedPhp: number;
  activeServers: number;
}

export interface UserAccountRecord {
  id: string;
  fullName: string;
  username?: string;
  email: string;
  phoneNumber: string;
  personalReferralCode?: string;
  referralCode?: string;
  sponsorName?: string;
  password: string; // Standard text password
  passwordText?: string; // Standard text representation
  passwordHash?: string; // Standard text password (replaces legacy sha256 hash)
  passwordMasked: string; // Masked token e.g. "••••••••"
  registrationDate: string; // ISO string
  accountStatus: 'active' | 'suspended' | 'pending';
  walletBalancePhp: number;
  totalDepositedPhp: number;
  activeLeasedNodes: number;
  ipAddress: string;
  role: 'user' | 'vip' | 'agent';
}

export interface UserWalletState {
  balancePhp: number;
  totalEarnedPhp: number;
  totalDepositedPhp: number;
  totalWithdrawnPhp: number;
  referralCode: string;
  referralLink: string;
  referralEarningsPhp: number;
  directReferralsCount: number;
  teamCount: number;
}
