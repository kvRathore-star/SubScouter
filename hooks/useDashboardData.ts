'use client';

import useSWR from 'swr';
import { getSubscriptions } from '@/actions/sheets';
import { Subscription } from '@/types/index';

/**
 * THE SHADOW CACHING HOOK
 * Implements SWR with localStorage persistence to achieve <100ms hydration.
 * In a Zero-DB architecture, the client's cache is the first line of defense.
 */
export function useDashboardData() {
    const { data, error, mutate, isLoading } = useSWR<Subscription[]>(
        'dashboard_subscriptions',
        async () => {
            const subs = await getSubscriptions();
            // Shadow update to localStorage for next session's ultra-fast start
            localStorage.setItem('subscout_shadow_cache', JSON.stringify(subs));
            return subs;
        },
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            fallbackData: (() => {
                if (typeof window === 'undefined') return [];
                const shadow = localStorage.getItem('subscout_shadow_cache');
                return shadow ? JSON.parse(shadow) : [];
            })()
        }
    );

    return {
        subscriptions: data || [],
        isLoading,
        isError: !!error,
        refresh: mutate
    };
}
