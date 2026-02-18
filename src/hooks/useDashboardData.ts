'use client';

import { useEffect, useState } from 'react';
import { useScoutStore } from './useScoutStore';
import { Subscription } from '@/types/index';

/**
 * THE LOCAL-FIRST DATA HOOK
 * Replaces SWR with useScoutStore (IndexedDB).
 * Provides ultra-fast, offline-ready data for the dashboard.
 */
export function useDashboardData() {
    const { getAllSubscriptions, loading } = useScoutStore();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refresh = async () => {
        setIsLoading(true);
        const data = await getAllSubscriptions();
        setSubscriptions(data);
        setIsLoading(false);
    };

    useEffect(() => {
        if (!loading) {
            refresh();
        }
    }, [loading]);

    return {
        subscriptions,
        isLoading: isLoading || loading,
        isError: false,
        refresh
    };
}
