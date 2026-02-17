
export type SubscriptionStatus = 'active' | 'paused' | 'canceled' | 'expired';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'trial';
  category: string;
  nextBillingDate: string;
  status: SubscriptionStatus;
  logoUrl?: string;
  description?: string;
  isTrial?: boolean;
  confidence?: number;
  lastUsedDate?: string;
  usageScore?: number;
  startDate?: string;
  canceledDate?: string;
  actionRequested?: 'CANCEL' | 'PAUSE' | 'RESUME';
  lastActionStatus?: 'PENDING' | 'SUCCESS' | 'FAILED';
}

export interface LinkedEmail {
  id: string;
  email: string;
  provider: 'google' | 'outlook' | 'apple' | 'imap';
  lastScanned: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  status: 'active' | 'error' | 'reauth_required';
  lastMessageId?: string;
  imapConfig?: {
    host: string;
    port: number;
    tls: boolean;
    user: string;
    password?: string; // App-specific or encrypted
  };
}

export interface DiscoveredSubscription {
  name: string;
  amount: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'trial';
  category?: string;
  confidence: number;
  snippet: string;
  isTrial?: boolean;
  nextBillingDate?: string;
  logoUrl?: string;
}

export interface SpendingStats {
  totalMonthly: number;
  totalYearly: number;
  potentialSavings: number;
  activeCount: number;
  unusedCount: number;
  renewalSoonCount: number;
  trialCount: number;
  canceledCount: number;
}

export interface AIAdvice {
  verdict: 'KEEP' | 'CANCEL' | 'REVIEW';
  reasoning: string;
  savingsOpportunity: string;
}

export interface UserSettings {
  name: string;
  email: string;
  currency: string;
  notifications: boolean;
  theme: 'light' | 'dark';
  reminderDays: number; // days before renewal to remind
}

export interface RenewalReminder {
  subscriptionId: string;
  subscriptionName: string;
  amount: number;
  currency: string;
  renewalDate: string;
  daysUntilRenewal: number;
  dismissed: boolean;
}

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
] as const;

export const CATEGORIES = [
  'Entertainment', 'Software', 'Music', 'News', 'Cloud',
  'Shopping', 'Productivity', 'Utilities', 'Business', 'Health',
  'Education', 'Finance', 'Other'
] as const;

export type FilterTab = 'all' | 'active' | 'trials' | 'paused' | 'past';
