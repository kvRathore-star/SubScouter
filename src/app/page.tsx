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
import VolumeAllocationWidget from '@/components/features/VolumeAllocationWidget';
import StatisticsView from '@/components/views/StatisticsView';
import ConnectionsView from '@/components/views/ConnectionsView';
import PricingView from '@/components/views/PricingView';
import AccountView from '@/components/views/AccountView';
import PortalView from '@/components/views/PortalView';
import LandingView from '@/components/views/LandingView';
import { DashboardSkeleton } from '@/components/layout/Skeleton';
import LoadingOverlay from '@/components/features/LoadingOverlay';
import EmptyState from '@/components/features/EmptyState';
import { Subscription, SpendingStats, LinkedEmail, FilterTab } from '@/types/index';
import { Plus, Sparkles, Download, Folder } from "lucide-react"
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
  const [activeWorkspace, setActiveWorkspace] = useState<'All' | 'Personal' | 'Business' | 'Family'>('All');
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

        const matchesWorkspace = activeWorkspace === 'All' || s.workspaceId === activeWorkspace;

        const matchesSearch = s.name.toLowerCase().includes(searchText.toLowerCase()) ||
          s.category.toLowerCase().includes(searchText.toLowerCase());

        return matchesFilter && matchesWorkspace && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price') return b.amount - a.amount;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime();
      });
  }, [subscriptions, filter, searchText, sortBy]);

  const handleConnect = useCallback(() => setShowConnectModal(true), []);

  const handleExportCSV = useCallback(() => {
    const headers = ['Name', 'Amount', 'Currency', 'Billing Cycle', 'Category', 'Workspace', 'Next Billing Date', 'Status'];
    const rows = sortedAndFilteredSubs.map(s => [
      s.name,
      s.amount.toString(),
      s.currency,
      s.billingCycle,
      s.category,
      s.workspaceId || 'None',
      s.nextBillingDate || 'Unknown',
      s.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.map(item => `"${item}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subscouter_export_${activeWorkspace.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [sortedAndFilteredSubs, activeWorkspace]);

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

  if (!isSignedIn) {
    return <LandingView />;
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
        <div className="max-w-[1400px] mx-auto stagger-in flex flex-col gap-6 pt-2">

          <StatsOverview stats={stats} />

          {/* Recent Infiltration Stacked Bento Cards */}
          <div className="flex flex-col gap-6 mb-12">
            {/* Create chunks of 2 subscriptions per block */}
            {Array.from({ length: Math.ceil(Math.min(sortedAndFilteredSubs.length, 6) / 2) }).map((_, index) => {
              const subsInBlock = sortedAndFilteredSubs.slice(index * 2, index * 2 + 2);

              return (
                <div key={index} className="bento-card flex flex-col p-6">
                  <h3 className="text-[11px] font-bold text-white uppercase tracking-widest mb-6">Recent Infiltration</h3>
                  <div className="flex flex-col md:flex-row gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
                    {subsInBlock.map(sub => (
                      <div key={sub.id} onClick={() => setSelectedSub(sub)} className="flex-1 flex gap-4 pt-4 md:pt-0 md:pl-4 first:pt-0 first:pl-0 cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-[#0f172a] border border-[#1e293b] flex items-center justify-center shrink-0 overflow-hidden shadow-inner group-hover:border-[#22d3ee]/30 transition-colors">
                          {sub.logoUrl ? (
                            <img src={sub.logoUrl} alt={sub.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white text-[12px] font-black tracking-tighter text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">
                              {sub.name.substring(0, 1).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 md:gap-4 mt-1 w-full relative">
                          <div className="flex items-center gap-2">
                            <h4 className="text-[13px] font-medium text-[#cbd5e1]">{sub.name} - Premium Plan</h4>
                          </div>
                          <div className="flex items-center justify-between w-full pr-12">
                            <span className="text-[12px] font-medium text-[#64748b]">Renewal: ${sub.amount.toFixed(2)}/month</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {sortedAndFilteredSubs.length === 0 && (
              <div className="bento-card flex flex-col items-center justify-center p-12 text-center min-h-[200px]">
                <h3 className="text-white font-black text-lg tracking-tight mb-2">Perimeter Secure</h3>
                <p className="text-[#64748b] text-sm font-medium tracking-wide">No recent infiltrations detected in your ecosystem.</p>
              </div>
            )}
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
