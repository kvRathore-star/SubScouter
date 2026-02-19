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

export default function Dashboard() {
  const { isLoaded, isSignedIn, user, signOut } = useAppAuth();
  const { subscriptions, isLoading: isDataLoading, refresh } = useDashboardData();
  const { saveSubscriptions, deleteSubscription, syncToCloud, restoreFromCloud } = useScoutStore();

  // Guards
  if (!isLoaded) return <DashboardSkeleton />;
  if (!isSignedIn) return <PortalView />;

  /*
  // COMMENTED OUT LOGIC FOR DEBUGGING
  const stats: SpendingStats = useMemo(() => { ... });
  const sortedAndFilteredSubs = useMemo(() => { ... });
  const chartData = useMemo(() => { ... });
  */

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white flex-col gap-4">
      <h1 className="text-4xl font-bold">DEBUG DASHBOARD (SIGNED IN)</h1>
      <p>If you see this, page.tsx crash is in useMemo or Render logic.</p>
    </div>
  );
}
