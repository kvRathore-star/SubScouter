"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppAuth } from '@/hooks/useAppAuth';
import Layout, { ViewType } from '@/components/layout/Layout';
import LandingPage from '@/components/views/LandingPage';
import { useDashboardData } from '@/hooks/useDashboardData';
import StatsOverview from '@/components/features/StatsOverview';
import SubscriptionCard from '@/components/features/SubscriptionCard';
import AddSubscriptionModal from '@/components/modals/AddSubscriptionModal';
import StatisticsView from '@/components/views/StatisticsView';
import ConnectionsView from '@/components/views/ConnectionsView';
import PricingView from '@/components/views/PricingView';
import AccountView from '@/components/views/AccountView';
import CommandCenter from '@/components/features/CommandCenter';
import AddEmailConnectionModal from '@/components/modals/AddEmailConnectionModal';
import { DashboardSkeleton } from '@/components/layout/Skeleton';
import LoadingOverlay from '@/components/features/LoadingOverlay';
import EmptyState from '@/components/features/EmptyState';
import OnboardingWizard from '@/components/features/OnboardingWizard';
import { Subscription, SpendingStats, LinkedEmail, FilterTab, RenewalReminder } from '@/types/index';
import { getSubscriptions, saveSubscriptions, getIntegrations, saveIntegration } from '@/actions/sheets';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Plus, Search, Bell, ChevronDown, AlertCircle, Sparkles, ShieldAlert, Target, Clock } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const { isLoaded, isSignedIn, user, signOut, isMock } = useAppAuth();

  const { subscriptions, isLoading: isDataLoading, refresh } = useDashboardData();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [linkedEmails, setLinkedEmails] = useState<LinkedEmail[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'name'>('date');
  const [searchText, setSearchText] = useState('');
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [userTier, setUserTier] = useState<'free' | 'pro'>('free');
  const [yearFilter, setYearFilter] = useState<number>(new Date().getFullYear());
  const [showReminders, setShowReminders] = useState(true);
  const [commandOpen, setCommandOpen] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('subscout_onboarding_v2');
    if (!hasCompletedOnboarding && isSignedIn) {
      setShowOnboarding(true);
    }
  }, [isSignedIn]);

  // Handle initial data synchronization and loading state
  useEffect(() => {
    const syncFinancialNodes = async () => {
      if (isSignedIn) {
        try {
          const integrations = await getIntegrations();
          setLinkedEmails(integrations);
        } catch (e) {
          console.error("[Sub Scouter] Initial sync failure:", e);
        } finally {
          setIsLoading(false);
        }
      } else if (isLoaded) {
        setIsLoading(false);
      }
    };

    if (isLoaded) {
      syncFinancialNodes();
    }
  }, [isSignedIn, isLoaded]);

  const handleConnect = useCallback(() => {
    setShowConnectModal(true);
  }, []);

  const handleConnectionAdd = useCallback(async (conn: Partial<LinkedEmail>) => {
    if (conn.provider === 'google' || conn.provider === 'outlook') {
      if (isMock) {
        const mockEmail: LinkedEmail = {
          id: Math.random().toString(36).substring(7),
          email: `${conn.provider}@subscout.ai`,
          provider: conn.provider as any,
          lastScanned: new Date().toISOString().split('T')[0],
          status: 'active' as const
        };
        setLinkedEmails(prev => [...prev, mockEmail]);
      } else {
        window.location.href = 'https://accounts.clerk.com/user';
      }
      return;
    }

    // IMAP Connection
    const newConn: LinkedEmail = {
      id: crypto.randomUUID(),
      email: conn.email || '',
      provider: conn.provider as any,
      lastScanned: 'Never',
      status: 'active',
      imapConfig: conn.imapConfig
    };

    setLinkedEmails(prev => [...prev, newConn]);
    setIsLoading(true);
    try {
      await saveIntegration(newConn);
    } catch (e) {
      console.error("[Sub Scouter] Connection persistence failure:", e);
    } finally {
      setIsLoading(false);
    }
  }, [isMock, saveIntegration]);

  const stats: SpendingStats = useMemo(() => {
    return {
      totalMonthly: subscriptions.reduce((acc, s) => acc + (s.status === 'active' ? s.amount : 0), 0),
      totalYearly: subscriptions.reduce((acc, s) => acc + (s.status === 'active' ? s.amount * 12 : 0), 0),
      potentialSavings: subscriptions.filter(s => (s.usageScore || 0) < 30).reduce((acc, s) => acc + s.amount, 0),
      activeCount: subscriptions.filter(s => s.status === 'active').length,
      unusedCount: subscriptions.filter(s => (s.usageScore || 0) < 30).length,
      renewalSoonCount: subscriptions.filter(s => {
        const days = Math.ceil((new Date(s.nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return days <= 7 && days >= 0;
      }).length,
      trialCount: subscriptions.filter(s => s.isTrial).length,
      canceledCount: subscriptions.filter(s => s.status === 'canceled').length,
    };
  }, [subscriptions]);

  const reminders: RenewalReminder[] = useMemo(() => {
    return subscriptions
      .filter(s => s.status === 'active')
      .map(s => {
        const days = Math.ceil((new Date(s.nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return {
          subscriptionId: s.id,
          subscriptionName: s.name,
          daysUntilRenewal: days,
          amount: s.amount,
          currency: s.currency,
          renewalDate: s.nextBillingDate,
          dismissed: false
        };
      })
      .filter(r => r.daysUntilRenewal <= 7 && r.daysUntilRenewal >= 0);
  }, [subscriptions]);

  const handleAdd = useCallback(async (sub: Partial<Subscription>) => {
    const newSub: Subscription = {
      id: crypto.randomUUID(),
      name: sub.name || '',
      amount: sub.amount || 0,
      currency: sub.currency || 'USD',
      category: sub.category || 'Other',
      billingCycle: sub.billingCycle || 'monthly',
      nextBillingDate: sub.nextBillingDate || new Date().toISOString().split('T')[0],
      status: 'active',
      logoUrl: sub.logoUrl,
      usageScore: 100
    };
    const updated = [newSub, ...subscriptions];
    refresh(updated, false);
    await saveSubscriptions(updated);
  }, [subscriptions, refresh]);

  const handleCancel = useCallback(async (id: string) => {
    const updated = subscriptions.map(s => s.id === id ? { ...s, status: 'canceled' as const } : s);
    refresh(updated, false);
    await saveSubscriptions(updated);
  }, [subscriptions, refresh]);

  const handlePause = useCallback(async (id: string) => {
    const updated = subscriptions.map(s => s.id === id ? { ...s, status: 'paused' as const } : s);
    refresh(updated, false);
    await saveSubscriptions(updated);
  }, [subscriptions, refresh]);

  const handleResume = useCallback(async (id: string) => {
    const updated = subscriptions.map(s => s.id === id ? { ...s, status: 'active' as const } : s);
    refresh(updated, false);
    await saveSubscriptions(updated);
  }, [subscriptions, refresh]);

  const sortedAndFilteredSubs = useMemo(() => {
    return subscriptions
      .filter(s => {
        const matchesFilter =
          filter === 'all' ||
          (filter === 'active' && s.status === 'active' && !s.isTrial) ||
          (filter === 'trials' && s.isTrial) ||
          (filter === 'paused' && s.status === 'paused') ||
          (filter === 'past' && s.status === 'canceled');
        const matchesSearch = s.name.toLowerCase().includes(searchText.toLowerCase()) ||
          s.category.toLowerCase().includes(searchText.toLowerCase());
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price') return b.amount - a.amount;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime();
      });
  }, [subscriptions, filter, searchText, sortBy]);

  const chartData = useMemo(() => {
    const categories = Array.from(new Set(subscriptions.map(s => s.category)));
    return categories.map(cat => ({
      name: cat.toUpperCase(),
      value: subscriptions
        .filter(s => s.category === cat && s.status === 'active')
        .reduce((acc, s) => acc + s.amount, 0)
    })).sort((a, b) => b.value - a.value);
  }, [subscriptions]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  if (!isLoaded) return <DashboardSkeleton />;
  if (!isSignedIn) return <LandingPage />;

  const filterTabs: { id: FilterTab; label: string; count?: number }[] = [
    { id: 'all', label: 'All', count: subscriptions.length },
    { id: 'active', label: 'Active', count: stats.activeCount },
    { id: 'trials', label: 'Trials', count: stats.trialCount },
    { id: 'paused', label: 'Paused', count: subscriptions.filter(s => s.status === 'paused').length },
    { id: 'past', label: 'Past', count: stats.canceledCount },
  ];

  return (
    <Layout
      currentView={currentView}
      setView={setCurrentView}
      notificationCount={stats.unusedCount + reminders.length}
      onLogout={() => signOut()}
      tier={userTier}
      onConnect={handleConnect}
    >
      {isLoading && <LoadingOverlay message="NEURAL SYNCHRONIZATION IN PROGRESS..." />}
      {showOnboarding && (
        <OnboardingWizard
          userFirstName={user?.firstName || ''}
          onComplete={async (discovered) => {
            setShowOnboarding(false);
            localStorage.setItem('subscout_onboarding_v2', 'true');
            if (discovered.length > 0) {
              // Convert discovered to full Subscription type and save
              const newSubs: Subscription[] = discovered.map(d => ({
                id: crypto.randomUUID(),
                name: d.name,
                amount: d.amount,
                currency: d.currency || 'USD',
                category: d.category || 'Other',
                billingCycle: (d.isTrial ? 'trial' : d.billingCycle) as any,
                nextBillingDate: d.nextBillingDate || new Date().toISOString().split('T')[0],
                status: 'active',
                logoUrl: d.logoUrl,
                usageScore: 100,
                isTrial: d.isTrial
              }));
              const updated = [...newSubs, ...subscriptions];
              refresh(updated, false);
              await saveSubscriptions(updated);
            }
          }}
        />
      )}

      {currentView === 'dashboard' && (
        <div className="max-w-[1400px] mx-auto stagger-in">
          {/* ═══ STATS OVERVIEW ═══ */}
          <div className="mb-12">
            <StatsOverview stats={stats} />
          </div>
          {/* ═══ PROACTIVE NUDGE ENGINE ═══ */}
          <AnimatePresence>
            {reminders.length > 0 && showReminders && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-12"
              >
                <div className="bg-brand/5 border border-brand/20 rounded-[32px] p-8 sm:p-10 shadow-2xl shadow-brand/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8">
                    <ShieldAlert className="w-24 h-24 text-brand/5 rotate-12" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="px-3 py-1 bg-brand text-white text-[10px] font-bold uppercase tracking-widest rounded-lg">High Priority</div>
                      <h3 className="text-2xl font-bold tracking-tight uppercase">Upcoming subscriptions</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {reminders.slice(0, 3).map(r => (
                        <div key={r.subscriptionId} className="card-glass p-6 border-brand/10 hover:border-brand/30 transition-all flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <span className="text-lg font-bold uppercase truncate max-w-[150px]">{r.subscriptionName}</span>
                              <span className="text-lg font-bold tabular-nums">${r.amount.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground mb-6">
                              <Clock className="w-4 h-4 text-brand" />
                              <span className="text-sm font-bold">
                                {r.daysUntilRenewal === 0 ? 'DUE TODAY' : `Scheduled for extraction in ${r.daysUntilRenewal}d`}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCancel(r.subscriptionId)}
                            className="btn-ghost w-full py-3 text-[10px] font-black uppercase tracking-widest border-brand/20 hover:bg-brand/5 group"
                          >
                            <Target className="w-3 h-3 text-brand group-hover:scale-125 transition-transform" />
                            <span>Deploy Assassin</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══ HEADER + ANALYTICS ═══ */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-12">
            <div className="xl:col-span-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-4xl font-black tracking-tight uppercase italic group">
                  Intelligence <span className="text-brand">Grid</span>
                </h2>
                <div className="w-2 h-2 rounded-full bg-brand animate-pulse shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
              </div>
              <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground/40 uppercase mb-8">Synchronized across {linkedEmails.length} neural nodes.</p>

              <div className="space-y-4">
                <div className="card-glass p-6">
                  <div className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-1">Monthly Burn Rate</div>
                  <div className="text-3xl font-black tabular-nums">${stats.totalMonthly.toFixed(2)}</div>
                </div>
                <div className="card-glass p-6 border-emerald-500/20 bg-emerald-500/5">
                  <div className="text-[10px] font-black tracking-widest text-emerald-600 uppercase mb-1">Extraction Potential</div>
                  <div className="text-3xl font-black tabular-nums text-emerald-600">${stats.potentialSavings.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-3 card-glass p-8 bg-muted/20">
              <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase italic">Flow Analysis (Last 30 Cycles)</span>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand" />
                    <span className="text-[10px] font-black uppercase text-muted-foreground">Allocation</span>
                  </div>
                </div>
              </div>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.05} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: 'currentColor', opacity: 0.4 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: 'currentColor', opacity: 0.4 }} />
                    <Tooltip
                      cursor={{ fill: 'rgba(var(--brand-rgb), 0.05)' }}
                      contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 4, 4]} maxBarSize={32}>
                      {chartData.map((_, i) => <Cell key={`c-${i}`} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ═══ FILTER CONTROL ═══ */}
          <div className="flex flex-wrap items-center justify-between gap-6 mb-8 sticky top-0 z-30 py-4 bg-background/80 backdrop-blur-xl border-b border-border/50 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-2 p-1 bg-muted/50 rounded-2xl border border-border">
              {filterTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`
                            px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                            ${filter === tab.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}
                        `}
                >
                  {tab.label} {tab.count ? `(${tab.count})` : ''}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <input
                  type="text"
                  placeholder="SEARCH INTELLIGENCE GRID..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full bg-muted/30 border border-border/50 rounded-2xl py-3 pl-12 pr-4 text-xs font-black tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                />
              </div>
              <button onClick={() => setShowAddModal(true)} className="btn-primary p-3 rounded-2xl aspect-square shadow-xl shadow-brand/20">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ═══ INTELLIGENCE GRID ═══ */}
          <div className="relative isolate">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-32">
              <AnimatePresence>
                {sortedAndFilteredSubs.map((sub, i) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <SubscriptionCard
                      subscription={sub}
                      onCancel={handleCancel}
                      onPause={handlePause}
                      onReApply={handleResume}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {sortedAndFilteredSubs.length === 0 && (
                <div className="col-span-full py-20">
                  <EmptyState
                    onDiscovery={() => setShowOnboarding(true)}
                    title="Sensor Silence"
                    description="No financial nodes identified in the current sector."
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {currentView === 'connections' && <ConnectionsView emails={linkedEmails} onConnect={handleConnect} onAddSubscription={handleAdd} onManualScout={async () => { }} tier={userTier} />}
      {currentView === 'insights' && (
        <StatisticsView
          chartData={chartData}
          transactions={transactions}
          userName={user?.fullName || user?.firstName || 'Valued User'}
          userEmail={user?.primaryEmailAddress?.emailAddress || ''}
        />
      )}
      {currentView === 'account' && (
        <AccountView
          transactions={transactions}
          emails={linkedEmails}
          onConnect={handleConnect}
          onAddSubscription={handleAdd}
          onManualScout={async () => { }}
          tier={userTier}
        />
      )}
      {currentView === 'pricing' && <PricingView currentTier={userTier} onUpgrade={() => setUserTier('pro')} />}

      {showAddModal && <AddSubscriptionModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />}
      {showConnectModal && <AddEmailConnectionModal onClose={() => setShowConnectModal(false)} onConnect={handleConnectionAdd} />}
      <CommandCenter isOpen={commandOpen} onClose={() => setCommandOpen(false)} subscriptions={subscriptions} onAction={(id: string, a: string) => { if (a === 'pause') handlePause(id); else if (a === 'halt') handleCancel(id); else handleResume(id); }} />
    </Layout>
  );
}
