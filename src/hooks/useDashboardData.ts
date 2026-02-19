'use client';

import { useEffect, useState } from 'react';
import { useScoutStore } from './useScoutStore';
import { Subscription } from '@/types/index';

/**
 * Dashboard Data Hook
 * Loads subscriptions from IndexedDB (local-first).
 * Works for both signed-in and guest users.
 */
export function useDashboardData() {
    const { getAllSubscriptions, loading } = useScoutStore();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refresh = async () => {
        setIsLoading(true);
        try {
            const data = await getAllSubscriptions();
            setSubscriptions(data);
        } catch (err) {
            console.error("[Dashboard] Failed to load subscriptions:", err);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (!loading) {
            refresh();
        } else {
            // Safety timeout: release loading state after 4s max
            const timer = setTimeout(() => {
                if (isLoading) setIsLoading(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [loading]);

    return {
        subscriptions,
        isLoading: isLoading || loading,
        isError: false,
        refresh
    };
}
