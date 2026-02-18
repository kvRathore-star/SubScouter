"use client";
export const runtime = 'edge';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppAuth } from '@/hooks/useAppAuth';
import Layout, { ViewType } from '@/components/layout/Layout';
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

/**
 * THE SOVEREIGN DASHBOARD
 * Core entry point for the SubScouter application.
 */
export default function Dashboard() {
  const { isLoaded, isSignedIn, user, signOut } = useAppAuth();
  const { subscriptions, isLoading: isDataLoading, refresh } = useDashboardData();
  const { saveSubscriptions, deleteSubscription } = useScoutStore();

  if (isLoaded && !isSignedIn) {
    return <PortalView />;
  }

  const [linkedEmails, setLinkedEmails] = useState<LinkedEmail[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'name'>('date');
  const [searchText, setSearchText] = useState('');
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [userTier, setUserTier] = useState<'free' | 'pro'>('free');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    // Load local integrations from localStorage for now (stateless engine)
    const storedNodes = localStorage.getItem('subscouter_nodes');
    if (storedNodes) setLinkedEmails(JSON.parse(storedNodes));
  }, []);

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
    refresh();
  }, [saveSubscriptions, refresh]);

  const handleCancel = useCallback(async (id: string) => {
    const sub = subscriptions.find(s => s.id === id);
    if (sub) {
      await saveSubscriptions([{ ...sub, status: 'canceled' as const }]);
      refresh();
    }
  }, [subscriptions, saveSubscriptions, refresh]);

  const handlePause = useCallback(async (id: string) => {
    const sub = subscriptions.find(s => s.id === id);
    if (sub) {
      await saveSubscriptions([{ ...sub, status: 'paused' as const }]);
      refresh();
    }
  }, [subscriptions, saveSubscriptions, refresh]);

  const handleResume = useCallback(async (id: string) => {
    const sub = subscriptions.find(s => s.id === id);
    if (sub) {
      await saveSubscriptions([{ ...sub, status: 'active' as const }]);
      refresh();
    }
  }, [subscriptions, saveSubscriptions, refresh]);

  const handleManualScout = useCallback(async () => {
    // Orchestrate client-side scan logic here
  }, []);

  const chartData = useMemo(() => {
    const categories: Record<string, number> = {};
    subscriptions.forEach(s => {
      categories[s.category] = (categories[s.category] || 0) + s.amount;
    });
    return Object.entries(categories).map(([name, value]) => ({ name: name.toUpperCase(), value }));
  }, [subscriptions]);

  if (!isLoaded) return <DashboardSkeleton />;

  return (
    <Layout
      currentView={currentView}
      setView={setCurrentView}
      notificationCount={stats.unusedCount}
      onLogout={() => signOut()}
      tier={userTier}
      onConnect={handleConnect}
    >
      {isDataLoading && <LoadingOverlay message="NEURAL SYNCHRONIZATION IN PROGRESS..." />}

      {currentView === 'dashboard' && (
        <div className="max-w-[1400px] mx-auto stagger-in">
          <StatsOverview stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 my-12">
            <div className="lg:col-span-3">
              <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                <div className="flex gap-2 p-1 bg-white rounded-2xl border border-[#e2e8f0]">
                  {['all', 'active', 'trials', 'past'].map(t => (
                    <button key={t} onClick={() => setFilter(t as any)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-[#f1f5f9] text-[#0f172a]' : 'text-[#64748b]'}`}>
                      {t}
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowAddModal(true)} className="bg-[#0f172a] text-white px-6 py-3 rounded-2xl shadow-xl shadow-[#0f172a]/20 flex items-center gap-2 hover:bg-[#1e293b] transition-all">
                  <Plus className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Add Extraction</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedAndFilteredSubs.map(sub => (
                  <SubscriptionCard
                    key={sub.id}
                    subscription={sub}
                    onCancel={handleCancel}
                    onPause={handlePause}
                    onReApply={handleResume}
                  />
                ))}

                {sortedAndFilteredSubs.length === 0 && <EmptyState onDiscovery={() => { }} title="Sensor Silence" description="No nodes identified." />}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border border-[#e2e8f0] rounded-[32px] p-8 space-y-6 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-brand">
                  <Sparkles className="w-4 h-4" />
                  Intelligence Feed
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-brand/[0.03] border border-brand/10">
                    <p className="text-[10px] font-bold text-[#64748b] uppercase mb-1">Status</p>
                    <p className="text-xs font-black uppercase tracking-tighter text-[#0f172a]">Sovereign Protocol Active</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-brand/[0.03] border border-brand/10">
                    <p className="text-[10px] font-bold text-[#64748b] uppercase mb-1">Data Residency</p>
                    <p className="text-xs font-black uppercase tracking-tighter text-[#0f172a]">Local IndexedDB (100%)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === 'connections' && <ConnectionsView emails={linkedEmails} onConnect={handleConnect} onAddSubscription={handleAdd} onManualScout={handleManualScout} tier={userTier} />}

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
    </Layout>
  );
}
