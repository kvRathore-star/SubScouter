"use client";
export const runtime = 'edge';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppAuth } from '@/hooks/useAppAuth';
import Layout, { ViewType } from '@/components/layout/Layout';
import { useRouter } from 'next/navigation';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useScoutStore } from '@/hooks/useScoutStore';
import StatsOverview from '@/components/features/StatsOverview';
import SubscriptionCard from '@/components/features/SubscriptionCard';
import AddSubscriptionModal from '@/components/modals/AddSubscriptionModal';
import StatisticsView from '@/components/views/StatisticsView';
import ConnectionsView from '@/components/views/ConnectionsView';
import PricingView from '@/components/views/PricingView';
import AccountView from '@/components/views/AccountView';
import PortalView from '@/components/views/PortalView';
import { DashboardSkeleton } from '@/components/layout/Skeleton';
import LoadingOverlay from '@/components/features/LoadingOverlay';
import EmptyState from '@/components/features/EmptyState';
import { Subscription, SpendingStats, LinkedEmail, FilterTab } from '@/types/index';
import { Plus, Sparkles } from "lucide-react"
import CommandCenter from '@/components/features/CommandCenter';
import AddEmailConnectionModal from '@/components/modals/AddEmailConnectionModal';
import SubscriptionSlideOver from '@/components/modals/SubscriptionSlideOver';
import BurnRateOdometer from '@/components/features/BurnRateOdometer';

/**
 * Sub Scouter Dashboard
 * Core entry point with auth gate and subscription management.
 */
export default function Dashboard() {
  const { isLoaded, isSignedIn, user, signOut } = useAppAuth();
  const router = useRouter();
  const { subscriptions, isLoading: isDataLoading, refresh } = useDashboardData();
  const { saveSubscriptions, deleteSubscription, syncToCloud, restoreFromCloud } = useScoutStore();

  // ALL hooks must be declared before any conditional returns (React Rules of Hooks)
  const [linkedEmails, setLinkedEmails] = useState<LinkedEmail[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'name'>('date');
  const [searchText, setSearchText] = useState('');
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [userTier, setUserTier] = useState<'free' | 'pro'>('free');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);

  // Restore from cloud on sign-in
  useEffect(() => {
    if (isSignedIn && user && subscriptions.length === 0 && !isDataLoading) {
      restoreFromCloud(user.id).then((restored) => {
        if (restored) refresh();
      });
    }
  }, [isSignedIn, user, subscriptions.length, isDataLoading]);

  // Check URL params for post-OAuth scan trigger
  useEffect(() => {
    if (!isSignedIn) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'connections') {
      setCurrentView('connections');
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (!isSignedIn) return;
    (window as any).toggleCommandPalette = () => setCommandOpen(prev => !prev);
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      delete (window as any).toggleCommandPalette;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSignedIn]);

  useEffect(() => {
    if (!isSignedIn) return;
    const storedNodes = localStorage.getItem('subscouter_nodes');
    if (storedNodes) setLinkedEmails(JSON.parse(storedNodes));
  }, [isSignedIn]);

  const stats: SpendingStats = useMemo(() => {
    if (!Array.isArray(subscriptions)) return {
      totalMonthly: 0, totalYearly: 0, potentialSavings: 0,
      activeCount: 0, unusedCount: 0, renewalSoonCount: 0,
      trialCount: 0, canceledCount: 0
    };

    return {
      totalMonthly: (subscriptions || []).reduce((acc, s) => acc + (s.status === 'active' ? (s.amount || 0) : 0), 0),
      totalYearly: (subscriptions || []).reduce((acc, s) => acc + (s.status === 'active' ? (s.amount || 0) * 12 : 0), 0),
      potentialSavings: (subscriptions || []).filter(s => (s.usageScore || 0) < 30).reduce((acc, s) => acc + (s.amount || 0), 0),
      activeCount: (subscriptions || []).filter(s => s.status === 'active').length,
      unusedCount: (subscriptions || []).filter(s => (s.usageScore || 0) < 30).length,
      renewalSoonCount: (subscriptions || []).filter(s => {
        if (!s.nextBillingDate) return false;
        try {
          const days = Math.ceil((new Date(s.nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          return days <= 7 && days >= 0;
        } catch { return false; }
      }).length,
      trialCount: (subscriptions || []).filter(s => s.isTrial).length,
      canceledCount: (subscriptions || []).filter(s => s.status === 'canceled').length,
    };
  }, [subscriptions]);

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

  const handleConnect = useCallback(() => setShowConnectModal(true), []);

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
    await saveSubscriptions([newSub]);
    if (isSignedIn && user) await syncToCloud(user.id);
    refresh();
  }, [saveSubscriptions, refresh, isSignedIn, user, syncToCloud]);

  const handleCancel = useCallback(async (id: string) => {
    const sub = subscriptions.find(s => s.id === id);
    if (sub) {
      await saveSubscriptions([{ ...sub, status: 'canceled' as const }]);
      if (isSignedIn && user) await syncToCloud(user.id);
      refresh();
    }
  }, [subscriptions, saveSubscriptions, refresh, isSignedIn, user, syncToCloud]);

  const handlePause = useCallback(async (id: string) => {
    const sub = subscriptions.find(s => s.id === id);
    if (sub) {
      await saveSubscriptions([{ ...sub, status: 'paused' as const }]);
      if (isSignedIn && user) await syncToCloud(user.id);
      refresh();
    }
  }, [subscriptions, saveSubscriptions, refresh, isSignedIn, user, syncToCloud]);

  const handleResume = useCallback(async (id: string) => {
    const sub = subscriptions.find(s => s.id === id);
    if (sub) {
      await saveSubscriptions([{ ...sub, status: 'active' as const }]);
      if (isSignedIn && user) await syncToCloud(user.id);
      refresh();
    }
  }, [subscriptions, saveSubscriptions, refresh, isSignedIn, user, syncToCloud]);

  const handleManualScout = useCallback(async () => {
    // Navigate to connections view for scanning
    setCurrentView('connections');
  }, []);

  const chartData = useMemo(() => {
    const categories: Record<string, number> = {};
    subscriptions.forEach(s => {
      categories[s.category] = (categories[s.category] || 0) + s.amount;
    });
    return Object.entries(categories).map(([name, value]) => ({ name: name.toUpperCase(), value }));
  }, [subscriptions]);

  // Redirect unauthenticated users to /login removed for public access
  // useEffect(() => {
  //   if (isLoaded && !isSignedIn) {
  //     router.push('/login');
  //   }
  // }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <DashboardSkeleton />; // Only show skeleton while loading auth state, not if signed out
  }

  return (
    <Layout
      currentView={currentView}
      setView={setCurrentView}
      notificationCount={stats.unusedCount}
      onLogout={() => signOut()}
      tier={userTier}
      onConnect={handleConnect}
    >
      {isDataLoading && <LoadingOverlay message="Loading your subscriptions..." />}

      {currentView === 'dashboard' && (
        <div className="max-w-[1400px] mx-auto stagger-in flex flex-col gap-8">

          {/* Minimalist Header */}
          <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 py-4 pb-8">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter">SubScouter</h1>
              <p className="text-xs font-bold text-[#22d3ee] uppercase tracking-[0.3em] mt-2">Sovereign Control</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em] mb-1">Total Burn Rate</p>
              <div className="text-5xl font-black text-[#22d3ee] tracking-tighter shadow-sm"><BurnRateOdometer value={stats.totalMonthly} /></div>
            </div>
          </div>

          <StatsOverview stats={stats} />

          {/* Bottom Span: Recent Infiltration */}
          <div className="my-8">
            <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
              <h2 className="text-lg font-black text-white uppercase tracking-widest">Recent Infiltration</h2>
              <button onClick={() => setShowAddModal(true)} className="bg-[#22d3ee] text-black px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] flex items-center gap-2 hover:bg-[#22d3ee]/90 transition-all font-black uppercase tracking-widest text-[10px]">
                <Plus className="w-4 h-4 text-black" />
                Add Entry
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedAndFilteredSubs.map(sub => (
                <SubscriptionCard
                  key={sub.id}
                  subscription={sub}
                  onClick={(s) => setSelectedSub(s)}
                  onCancel={handleCancel}
                  onPause={handlePause}
                  onReApply={handleResume}
                />
              ))}

              {sortedAndFilteredSubs.length === 0 && (
                <div className="col-span-full">
                  <EmptyState
                    onDiscovery={() => setCurrentView('connections')}
                    title="Grid Empty"
                    description="Deploy Scout to secure your digital footprint."
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {currentView === 'connections' && <ConnectionsView emails={linkedEmails} onConnect={handleConnect} onAddSubscription={handleAdd} onManualScout={handleManualScout} tier={userTier} isSignedIn={isSignedIn} />}

      {currentView === 'statistics' && <StatisticsView chartData={chartData} subscriptions={subscriptions} />}

      {currentView === 'settings' && <AccountView tier={userTier} />}

      {currentView === 'billing' && <PricingView currentTier={userTier} onUpgrade={() => setUserTier('pro')} />}

      <CommandCenter
        isOpen={commandOpen}
        onClose={() => setCommandOpen(false)}
        subscriptions={subscriptions}
        onAction={(id, action) => {
          if (action === 'pause') handlePause(id);
          if (action === 'resume') handleResume(id);
        }}
        onNavigate={setCurrentView}
      />

      {showAddModal && <AddSubscriptionModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />}
      {showConnectModal && <AddEmailConnectionModal onClose={() => setShowConnectModal(false)} onConnect={() => { }} />}

      {/* Agentic Peek Panel */}
      <SubscriptionSlideOver
        subscription={selectedSub}
        isOpen={!!selectedSub}
        onClose={() => setSelectedSub(null)}
        onCancel={handleCancel}
        onPause={handlePause}
        onResume={handleResume}
      />
    </Layout>
  );
}
