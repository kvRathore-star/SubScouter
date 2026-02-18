'use client';

import { useEffect, useState } from 'react';
import { useAppAuth } from './useAppAuth';
import { useScoutStore } from './useScoutStore';
import { Subscription } from '@/types/index';

/**
 * THE LOCAL-FIRST DATA HOOK
 * Replaces SWR with useScoutStore (IndexedDB).
 * Provides ultra-fast, offline-ready data for the dashboard.
 */
export function useDashboardData() {
    const { isLoaded, isSignedIn } = useAppAuth();
    const { getAllSubscriptions, loading } = useScoutStore();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refresh = async () => {
        if (!isSignedIn) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        const data = await getAllSubscriptions();
        setSubscriptions(data);
        setIsLoading(false);
    };

    useEffect(() => {
        if (!loading && isLoaded) {
            refresh();
        }
    }, [loading, isLoaded, isSignedIn]);

    return {
        subscriptions,
        isLoading: isLoading || loading,
        isError: false,
        refresh
    };
}
